import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

// Teams / Points Table Collection
const teamsCollection = collection(db, 'teams');
// Matches / Schedule Collection
const matchesCollection = collection(db, 'matches');

// --- TEAMS / POINTS TABLE ---
export const getTeams = async () => {
  try {
    const snapshot = await getDocs(teamsCollection);
    const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by points (desc), then pointsDiff (desc)
    teams.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return (b.pointsDiff || 0) - (a.pointsDiff || 0);
    });
    
    return teams;
  } catch (error) {
    console.error("Error getting teams: ", error);
    return [];
  }
};

export const addTeam = async (teamData) => {
  try {
    const docRef = await addDoc(teamsCollection, {
      ...teamData,
      played: 0,
      won: 0,
      lost: 0,
      points: 0,
      pointsDiff: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding team: ", error);
    throw error;
  }
};

export const updateTeam = async (id, teamData) => {
  try {
    const teamDoc = doc(db, 'teams', id);
    await updateDoc(teamDoc, teamData);
  } catch (error) {
    console.error("Error updating team: ", error);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  try {
    const teamDoc = doc(db, 'teams', id);
    await deleteDoc(teamDoc);
  } catch (error) {
    console.error("Error deleting team: ", error);
    throw error;
  }
};

// --- SCHEDULE / MATCHES ---
export const getMatches = async () => {
  try {
    const q = query(matchesCollection, orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting matches: ", error);
    return [];
  }
};

export const addMatch = async (matchData) => {
  try {
    const docRef = await addDoc(matchesCollection, matchData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding match: ", error);
    throw error;
  }
};

export const updateMatch = async (id, matchData) => {
  try {
    const matchDoc = doc(db, 'matches', id);
    await updateDoc(matchDoc, matchData);
  } catch (error) {
    console.error("Error updating match: ", error);
    throw error;
  }
};

export const deleteMatch = async (id) => {
  try {
    const matchDoc = doc(db, 'matches', id);
    await deleteDoc(matchDoc);
  } catch (error) {
    console.error("Error deleting match: ", error);
    throw error;
  }
};
