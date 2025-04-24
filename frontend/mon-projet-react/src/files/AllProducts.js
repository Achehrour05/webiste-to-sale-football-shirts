import { boots } from './AllBoots';
import { tab } from './AllKits';
import { jak } from './AllJackets';
import { ba } from './AllBalls';

// On rassemble tous les produits dans un tableau à plat
const allBoots = Object.values(boots).flat();
const allKits = Object.values(tab).flat();
const allJackets = Object.values(jak).flat(); // tab contient plusieurs tableaux : france, english, etc.
const allBalls = Object.values(ba).flat();

export const all = [...allBoots, ...allKits, ...allJackets, ...allBalls];
