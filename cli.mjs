import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { INITIAL_SEED_DATA } from './src/data/seedData.js';

// Firebase configuration for tracker-5cfd5
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSy_YOUR_API_KEY_HERE",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "tracker-5cfd5.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "tracker-5cfd5",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "tracker-5cfd5.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "40136714501",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:40136714501:web:tracker"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DEFAULT_SETTINGS = {
  dailyTargetHours: 8,
  dailyTargetMaxHours: 10,
  dDayDate: '2026-10-15',
  dDayTitle: 'Upcoming OAs & Placements',
  coldRecallGateDefault: true,
  idleTimeoutMinutes: 10,
  autoAdvanceOnHotkey: true,
  theme: 'dark'
};

function resolveDateStr(inputDate) {
  if (!inputDate || inputDate === 'today') {
    return new Date().toISOString().split('T')[0];
  }
  if (inputDate === 'tomorrow') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  return inputDate;
}

async function listPlans(targetDateStr) {
  const dateStr = resolveDateStr(targetDateStr);
  console.log(`\nScheduled Plans for: ${dateStr}`);
  console.log('--------------------------------------------------');
  
  const q = query(collection(db, 'plans'), where('date', '==', dateStr));
  const snap = await getDocs(q);
  
  if (snap.empty) {
    console.log('No plans found for this date.');
    return;
  }

  let idx = 1;
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    const status = data.completed ? '[DONE]' : '[TODO]';
    console.log(`${idx++}. ${status} ${data.title} (${data.subjectId || 'dsa'})`);
  });
  console.log('--------------------------------------------------\n');
}

async function addPlanItem(title, dateInput, subjectId = 'dsa') {
  const dateStr = resolveDateStr(dateInput);
  const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

  const seedMatch = INITIAL_SEED_DATA.items.find(
    (i) => i.title.toLowerCase() === title.toLowerCase()
  );

  const planObj = {
    id: planId,
    date: dateStr,
    itemId: seedMatch ? seedMatch.id : null,
    title: seedMatch ? seedMatch.title : title,
    subjectId: seedMatch ? seedMatch.subjectId : subjectId,
    completed: false,
    order: Date.now()
  };

  await setDoc(doc(db, 'plans', planId), planObj);
  console.log(`\nAdded task to ${dateStr}: "${planObj.title}"`);
}

async function planTopic(topicId, limit = 5, dateInput = 'tomorrow') {
  const dateStr = resolveDateStr(dateInput);
  const uncompletedInTopic = INITIAL_SEED_DATA.items.filter(
    (i) => i.topicId === topicId && !i.done
  );

  if (uncompletedInTopic.length === 0) {
    console.log(`\nNo uncompleted problems found for topic: ${topicId}`);
    return;
  }

  const toAdd = uncompletedInTopic.slice(0, parseInt(limit, 10));
  console.log(`\nQueuing ${toAdd.length} problems from topic "${topicId}" to ${dateStr}...`);

  for (let idx = 0; idx < toAdd.length; idx++) {
    const item = toAdd[idx];
    const planId = `plan_${Date.now()}_${idx}`;
    const planObj = {
      id: planId,
      date: dateStr,
      itemId: item.id,
      title: item.title,
      subjectId: item.subjectId || 'dsa',
      completed: false,
      order: idx + 1
    };
    await setDoc(doc(db, 'plans', planId), planObj);
    console.log(`  + [${idx + 1}/${toAdd.length}] ${item.title}`);
  }

  console.log(`\nSuccessfully added ${toAdd.length} problems to ${dateStr}!`);
}

async function clearDatePlans(dateInput) {
  const dateStr = resolveDateStr(dateInput);
  console.log(`\nClearing all plans for date: ${dateStr}...`);
  const q = query(collection(db, 'plans'), where('date', '==', dateStr));
  const snap = await getDocs(q);

  let count = 0;
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, 'plans', docSnap.id));
    count++;
  }
  console.log(`Cleared ${count} tasks for ${dateStr}.`);
}

async function seedDatabase() {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  console.log('\nStarting full Firestore database seeding...');
  console.log('--------------------------------------------------');

  // 1. Seed Topics
  console.log(`Seeding ${INITIAL_SEED_DATA.topics.length} topics...`);
  for (const t of INITIAL_SEED_DATA.topics) {
    await setDoc(doc(db, 'topics', t.id), t);
  }

  // 2. Seed Subtopics
  console.log(`Seeding ${INITIAL_SEED_DATA.subtopics.length} subtopics...`);
  for (const st of INITIAL_SEED_DATA.subtopics) {
    await setDoc(doc(db, 'subtopics', st.id), st);
  }

  // 3. Seed Items
  console.log(`Seeding ${INITIAL_SEED_DATA.items.length} items...`);
  let count = 0;
  for (const item of INITIAL_SEED_DATA.items) {
    await setDoc(doc(db, 'items', item.id), item);
    count++;
    if (count % 50 === 0) {
      console.log(`  Progress: ${count}/${INITIAL_SEED_DATA.items.length} items seeded`);
    }
  }
  console.log(`Successfully seeded all ${count} items.`);

  // 4. Seed Settings
  console.log('Seeding default settings...');
  await setDoc(doc(db, 'settings', 'user_settings'), DEFAULT_SETTINGS);

  // 5. Seed ONLY tomorrow's plan
  console.log(`Seeding tomorrow's plan for date: ${tomorrowStr}...`);
  const existingPlans = await getDocs(collection(db, 'plans'));
  for (const pDoc of existingPlans.docs) {
    await deleteDoc(doc(db, 'plans', pDoc.id));
  }

  if (INITIAL_SEED_DATA.plans && INITIAL_SEED_DATA.plans.length > 0) {
    for (let idx = 0; idx < INITIAL_SEED_DATA.plans.length; idx++) {
      const planObj = INITIAL_SEED_DATA.plans[idx];
      const planId = `plan_${Date.now()}_${idx}`;
      const payload = {
        ...planObj,
        id: planId,
        date: tomorrowStr,
        order: idx + 1
      };
      await setDoc(doc(db, 'plans', planId), payload);
      console.log(`  + [Tomorrow Plan ${idx + 1}] ${planObj.title}`);
    }
  }

  console.log('--------------------------------------------------');
  console.log('Database seeding complete! All items and tomorrow\'s plan pushed to Firestore.\n');
}

async function showStatus() {
  const total = INITIAL_SEED_DATA.items.length;
  const done = INITIAL_SEED_DATA.items.filter((i) => i.done).length;
  const percentage = ((done / total) * 100).toFixed(1);

  console.log('\nStudy Tracker Status Summary');
  console.log('--------------------------------------------------');
  console.log(`Total Striver Problems : ${total}`);
  console.log(`Completed Problems     : ${done} (${percentage}%)`);
  console.log(`Remaining Problems     : ${total - done}`);
  console.log('--------------------------------------------------\n');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const getArg = (flag, defaultVal = null) => {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1]) return args[idx + 1];
    return defaultVal;
  };

  try {
    if (command === 'seed') {
      await seedDatabase();
    } else if (command === 'list') {
      await listPlans(getArg('--date', 'today'));
    } else if (command === 'add') {
      const title = getArg('--title');
      if (!title) {
        console.log('Error: --title is required.');
        process.exit(1);
      }
      await addPlanItem(title, getArg('--date', 'today'));
    } else if (command === 'plan') {
      await planTopic(
        getArg('--topic', 'dsa_trees'),
        getArg('--limit', 5),
        getArg('--date', 'tomorrow')
      );
    } else if (command === 'clear') {
      await clearDatePlans(getArg('--date', 'today'));
    } else if (command === 'status') {
      await showStatus();
    } else {
      console.log('Available commands: seed, list, add, plan, clear, status');
    }
  } catch (err) {
    console.error('CLI Execution Error:', err);
  } finally {
    process.exit(0);
  }
}

main();
