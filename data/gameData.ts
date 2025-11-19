
import { Badge, DetectiveChallenge, Quest } from "../types/gamification";

export const BADGES: Badge[] = [
  {
    id: "novice_historian",
    title: "Kezdő Történész",
    description: "Szerezz 50 pontot.",
    icon: "📜",
    colorClass: "from-gray-400 to-gray-600",
  },
  {
    id: "freedom_fighter",
    title: "Szabadságharcos",
    description: "Teljesítsd az 1848-as missziót.",
    icon: "⚔️",
    colorClass: "from-red-500 to-rose-600",
  },
  {
    id: "detective_master",
    title: "Igazságosztó",
    description: "3 helyes válasz egymás után a Nyomozó módban.",
    icon: "mjn",
    colorClass: "from-blue-500 to-cyan-600",
  },
  {
    id: "king_maker",
    title: "Királycsináló",
    description: "Ismerj fel minden Árpád-házi uralkodót.",
    icon: "👑",
    colorClass: "from-amber-400 to-yellow-600",
  },
];

export const QUESTS: Quest[] = [
  {
    id: "quest_1848",
    title: "A márciusi ifjak nyomában",
    description: "Éld át újra 1848. március 15. eseményeit lépésről lépésre!",
    category: "Forradalom",
    difficulty: "Könnyű",
    badgeId: "freedom_fighter",
    steps: [
      {
        id: "s1",
        title: "Gyülekező a Pilvaxban",
        date: "Reggel 8:00",
        description: "A forradalmi hangulatú kávéházban Petőfi Sándor elszavalja a Nemzeti dalt.",
      },
      {
        id: "s2",
        title: "Irány az Egyetem!",
        date: "Délelőtt 9:00",
        description: "Az ifjak az egyetemistákhoz vonulnak, hogy csatlakozásra bírják őket.",
      },
      {
        id: "s3",
        title: "Landerer nyomdája",
        date: "Délelőtt 10:30",
        description: "Cenzúra nélkül kinyomtatják a 12 pontot és a Nemzeti dalt. Ez a sajtószabadság ünnepe.",
      },
      {
        id: "s4",
        title: "Nemzeti Múzeum",
        date: "Délután 15:00",
        description: "Hatalmas tömeggyűlés a Múzeumkertben.",
      },
      {
        id: "s5",
        title: "Táncsics kiszabadítása",
        date: "Este 17:00",
        description: "A tömeg Budára vonul és kiszabadítja Táncsics Mihályt börtönéből.",
      },
    ],
  },
  {
    id: "quest_hunyadi",
    title: "A törökverő Hunyadiak",
    description: "Kövesd végig Hunyadi János és Mátyás dicsőséges hadjáratait.",
    category: "Középkor",
    difficulty: "Közepes",
    badgeId: "king_maker",
    steps: [
      { id: "h1", title: "Hosszú hadjárat", date: "1443-1444", description: "Sikeres téli hadjárat a Balkánon az Oszmán Birodalom ellen." },
      { id: "h2", title: "Nándorfehérvári diadal", date: "1456", description: "Világraszóló győzelem, a déli harangszó eredete." },
      { id: "h3", title: "Mátyás királlyá választása", date: "1458", description: "A Duna jegén (a hagyomány szerint) királlyá választják az igazságosat." },
    ]
  }
];

export const DETECTIVE_CHALLENGES: DetectiveChallenge[] = [
  {
    id: "d1",
    statement: "II. Rákóczi Ferencet a 'Nagyságos Fejedelem' néven emlegették.",
    isTrue: true,
    explanation: "Így van! Ez volt a korabeli hivatalos megszólítása és a nép is így tisztelte.",
    topic: "Rákóczi-szabadságharc",
    difficulty: 1,
  },
  {
    id: "d2",
    statement: "A mohácsi vész 1525-ben történt.",
    isTrue: false,
    explanation: "Hamis! A mohácsi csata dátuma 1526. augusztus 29.",
    topic: "Középkor",
    difficulty: 1,
  },
  {
    id: "d3",
    statement: "Az Aranybulla (1222) korlátozta a királyi hatalmat és jogokat adott a szervienseknek.",
    isTrue: true,
    explanation: "Pontosan. II. András adta ki, és a magyar alkotmányosság egyik alappillére.",
    topic: "Középkor",
    difficulty: 2,
  },
  {
    id: "d4",
    statement: "Kossuth Lajos volt az első felelős magyar miniszterelnök.",
    isTrue: false,
    explanation: "Ez hamis. Az első felelős miniszterelnök Gróf Batthyány Lajos volt. Kossuth pénzügyminiszter volt.",
    topic: "1848-49",
    difficulty: 2,
  },
  {
    id: "d5",
    statement: "A trianoni békeszerződést a Nagy-Trianon kastélyban írták alá.",
    isTrue: true,
    explanation: "Igen, Versailles-ban, a Nagy-Trianon palotában történt az aláírás 1920-ban.",
    topic: "20. század",
    difficulty: 1,
  }
];
