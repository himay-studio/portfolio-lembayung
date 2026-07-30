/**
 * THE COMBINED ASSET MANIFEST. This file is the single source of truth for MEDIA.md.
 *
 * `MEDIA.md` at the repo root is GENERATED from this array by `node scripts/gen-manifest.mjs`.
 * Do not hand edit MEDIA.md, edit here and re run the generator, or the two drift and Fahima
 * works from the wrong prompt.
 *
 * Why it lives in `src/data` rather than only in the markdown: the same `tag` line renders inside
 * the annotated `.ph` placeholder on the page, so the layout, the manifest and the handoff cannot
 * disagree about what belongs in a slot. The generator also ASSERTS the R49 contract, that the
 * number of SUBJECT blocks equals the number of asset paths, which is only checkable if both live
 * in one array.
 *
 * Rules that bind every row below:
 *
 *   R49  Each row carries its OWN distinct SUBJECT, written for THAT subject. No generic
 *        "glamping interior" prompt recycled across rows, and no single file wired into two slots.
 *        50 rows, 50 subjects, 50 unique paths.
 *   R33  The shared PHOTO DNA and NEGATIVE blocks from DESIGN.md 7.2 and 7.3 are appended to
 *        every photographic row BY THE GENERATOR, verbatim. They supplement the subject, they
 *        never replace it. L01 and L02 are excluded per LOGO.md section 10, because the flat
 *        vector logo prompts carry their own NEGATIVE and the photographic DNA would fight it.
 *   R62  At most ONE short string in focus per frame. Where brand signage appears, `Lembayung` is
 *        written verbatim and is the ONLY sharp string, with any category or tagline line
 *        composed out of focus so the model cannot invent a second brand name. There is NOT ONE
 *        bracketed token anywhere in this file: Wanantara shipped a sign rendering the literal
 *        text `[Jenis Satwa]` because a template placeholder was left in a prompt.
 *   R11  `tag` renders on screen inside the placeholder, so no em dash, no en dash, no entity form.
 *   R30 / R44  The hero video row is MANDATORY and never optional. V01 below.
 *   R43  Both logo variants are rows, folded in from LOGO.md section 10.
 *
 * Budget: 50 rows, inside the 45 to 55 cap the parent issue set, because every pixel is generated
 * by hand four at a time and Rangkai's 109 asset bundle is already in the queue ahead of this one.
 */

export type MediaRatio = '1:1' | '4:3' | '16:9';

export interface MediaRow {
  /** L01, L02, V01, M01 and up. Stable, quoted in the handoff. */
  id: string;
  /** exact output path under public/. A wrong filename is a broken asset at build time. */
  path: string;
  ratio: MediaRatio;
  model: 'Nano Banana' | 'Veo Lite';
  /** which part of the site consumes it, so a reviewer can find the slot */
  slot: string;
  /** one line, renders inside the annotated placeholder on the page */
  tag: string;
  /** the full 60 to 120 word SUBJECT block, R49. Empty only for rows whose prompt lives in LOGO.md. */
  subject: string;
  /** set when the prompt text is owned by another document and must be pasted verbatim from it */
  promptSource?: string;
}

export const MEDIA: MediaRow[] = [
  /* ------------------------------------------------------------------ logo pair, R43 ------- */
  {
    id: 'L01',
    path: 'img/logo.png',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Lockup utama, header saat scroll, badan halaman terang, gambar Open Graph',
    tag: '[MEDIA] Logo utama Lembayung, mark horizon empat bar plus wordmark, gradasi tanah terang, latar transparan. Rasio 1:1.',
    subject: '',
    promptSource: 'LOGO.md section 5.1, paste verbatim',
  },
  {
    id: 'L02',
    path: 'img/logo-inverted.png',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Lockup knockout, header gelap, drawer, footer senja pekat',
    tag: '[MEDIA] Logo knockout Lembayung untuk latar gelap, bar dicerahkan, wordmark putih kanvas, latar transparan. Rasio 1:1.',
    subject: '',
    promptSource: 'LOGO.md section 5.2, paste verbatim',
  },

  /* ------------------------------------------------------------- hero video, R30 R44 ------- */
  {
    id: 'V01',
    path: 'video/hero-lembayung.mp4',
    ratio: '16:9',
    model: 'Veo Lite',
    slot: 'Latar hero halaman beranda, muted autoplay loop',
    tag: '[MEDIA VIDEO] Hero 8 detik, dorongan lambat satu tarikan di lereng berundak jam 17.30, kabut menyeberang, api unggun menyala, langit jingga ke ungu. Rasio 16:9.',
    subject:
      'One continuous slow push in, no cuts, eight seconds. Open wide on a west facing terraced pine slope in the Lembang highlands at 17.30, five stone walled terraces stepping down and the Bandung valley glowing amber far below. Low mist drifts left to right across the middle terraces. In the lower third a communal stone fire ring catches and the flame lifts. Warm lamp light comes up behind the canvas of two cabin windows as the sky above shifts from amber into violet. No people in close up, at most two distant silhouettes standing on a timber deck. No text, no signage, no logo, no titles anywhere in frame.',
  },

  /* ------------------------------------------- Dome Senja, 4 frames, R41 R18 --------------- */
  {
    id: 'M01',
    path: 'img/units/dome-senja-eksterior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Dome Senja, kartu unit dan slide galeri 1',
    tag: '[MEDIA] Dome geodesik di teras kedua saat senja, langit ungu jingga di atas lembah. Rasio 1:1.',
    subject:
      'A five metre geodesic dome tent standing on a raised ironwood deck on the second of five stone walled terraces, photographed from slightly below so the terrace wall of stacked river stone fills the bottom of the frame. The dome is double layered pale canvas over a light steel frame, guy lines pegged taut into red earth, a clear panel set into the crown catching the last light. Behind and above it, mature pines. Beyond, the Bandung valley in amber haze under a violet and orange sky at 17.30. Two wooden chairs on the deck, one with a folded wool blanket over its back.',
  },
  {
    id: 'M02',
    path: 'img/units/dome-senja-interior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Dome Senja, slide galeri 2, juga varian 4 pax',
    tag: '[MEDIA] Interior Dome Senja, kasur queen dan panel atap bening memperlihatkan kanopi pinus. Rasio 1:1.',
    subject:
      'Inside a canvas geodesic dome at dusk, shot from the foot of the bed looking up and back. A queen bed with white linen creased on one side, a thick wool blanket pushed down, a jacket thrown over the wooden chair beside it. Directly overhead a 1,2 metre clear panel set into the canopy frame shows pine branches and a deepening violet sky. A single warm bulb on a cord throws light down the curve of the canvas. On the small side table an enamel mug half drunk, a paperback face down, a phone charging. Boots by the zipped door.',
  },
  {
    id: 'M03',
    path: 'img/units/dome-senja-dek.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Dome Senja, slide galeri 3, juga varian 2 pax lembah',
    tag: '[MEDIA] Dek kayu Dome Senja dengan dua kursi menghadap lembah pagi berkabut. Rasio 1:1.',
    subject:
      'A private ironwood deck in front of a canvas dome at 06.30, photographed from the doorway at standing height. Two simple wooden chairs face out over a low stone terrace wall towards a valley completely filled with white mist, only the far ridge line showing above it. The deck boards are dark and damp with dew, one plank marked by a muddy boot print. Between the chairs a low stool holds two enamel mugs steaming. Dew beads on the taut canvas at the left edge of the frame. Pine trunks rise out of the top of the frame. No people.',
  },
  {
    id: 'M04',
    path: 'img/units/dome-senja-detail.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Dome Senja, slide galeri 4',
    tag: '[MEDIA] Detail panel atap bening Dome Senja dilihat dari kasur pada malam berbintang. Rasio 1:1.',
    subject:
      'A tight detail shot taken from lying on the bed, looking straight up at the clear acrylic panel set into the crown of a canvas dome on a clear highland night. The aluminium frame ribs radiate out around the panel. Through the glass, pine branches in silhouette and a dense field of stars, the Milky Way faintly visible. A little condensation has beaded on the inside edge of the panel. In the bottom corner of the frame, soft and out of focus, the edge of a wool blanket and a hand resting on it. Only the panel is sharp.',
  },

  /* ------------------------------------------- Kabin Pinus, 4 frames ---------------------- */
  {
    id: 'M05',
    path: 'img/units/kabin-pinus-eksterior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Kabin Pinus, kartu unit dan slide galeri 1',
    tag: '[MEDIA] Kabin kayu A frame di antara pinus pada pagi berkabut. Rasio 1:1.',
    subject:
      'A two storey A frame cabin clad in local pine boards, standing between mature pine trunks on the third terrace at 06.30 in soft overcast highland light. Shot from the stone path below so the steep roof line runs to the top of the frame. Low mist hangs between the trees behind it and softens everything past ten metres. Wide glass doors on the ground floor reflect the pale sky, and an east facing roof window sits high in the gable. A pair of small trainers and one adult boot are lined up on the deck edge. Wet pine needles on the steps.',
  },
  {
    id: 'M06',
    path: 'img/units/kabin-pinus-interior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Kabin Pinus, slide galeri 2, juga varian 4 pax hutan',
    tag: '[MEDIA] Interior Kabin Pinus, kasur queen dan tangga kayu ke mezanin. Rasio 1:1.',
    subject:
      'The ground floor of a pine clad A frame cabin in the late afternoon, shot from the corner so both the bed and the stair are in frame. A queen bed against the plank wall, bedding rumpled on the near side, a childs cardigan on the end. To the right a narrow 70 centimetre wooden stair climbs to a mezzanine, its open side guarded by a 90 centimetre timber rail. Warm light comes through wide glass doors on the left. On the small table an electric kettle, two mugs, a scattered pack of playing cards. A backpack leans open against the stair.',
  },
  {
    id: 'M07',
    path: 'img/units/kabin-pinus-dek.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Kabin Pinus, slide galeri 3, juga varian 4 pax lembah',
    tag: '[MEDIA] Dek Kabin Pinus, meja dan empat kursi, keluarga Indonesia sedang sarapan. Rasio 1:1.',
    subject:
      'A timber deck in front of a pine cabin at about 07.30, with a plain wooden table and four chairs. An Indonesian family of four in jackets and beanies sits eating breakfast, the mother mid gesture reaching for a plate, a boy of about nine kneeling on his chair to look out at the valley, natural skin texture and stray hair. Rice, fried eggs and a plate of sliced fruit on the table, a thermos, four mismatched mugs. Beyond the deck rail, pine slope falling away with mist still sitting in the valley. Shot at standing eye level with a slight natural tilt.',
  },
  {
    id: 'M08',
    path: 'img/units/kabin-pinus-detail.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Kabin Pinus, slide galeri 4, juga varian 6 pax hutan',
    tag: '[MEDIA] Detail mezanin Kabin Pinus, dua kasur single dan jendela atap menghadap timur. Rasio 1:1.',
    subject:
      'The mezzanine of an A frame cabin from the top of the stair, low ceiling following the roof pitch. Two single mattresses side by side on the timber floor with quilts, one thrown back and one still tucked, a soft toy on the pillow. An east facing roof window directly above throws a bright rectangle of early light across the boards and up one sloping wall. The 90 centimetre timber guard rail runs along the open edge in the foreground, slightly out of focus. A pair of childrens socks and a torch on the floor. Visible grain and knots in the pine.',
  },

  /* ------------------------------------------- Tenda Bara, 4 frames ---------------------- */
  {
    id: 'M09',
    path: 'img/units/tenda-bara-eksterior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Tenda Bara, kartu unit dan slide galeri 1',
    tag: '[MEDIA] Bell tent kanvas di tepi hutan pinus dengan lingkar api unggun batu di depan pintu. Rasio 1:1.',
    subject:
      'A five metre cotton canvas bell tent with a central timber pole, pitched on the highest terrace right at the edge of a pine stand, photographed in the last golden light raking in from the west. Its floor sits on a timber platform raised about 20 centimetres off the red earth. Directly in front of the door, a circle of stacked river stones about a metre across, with dry split pine logs and a bundle of wood shavings already laid inside it, unlit. Guy lines run out of frame under visible tension. Pine trunks close behind, mist beginning to form between them.',
  },
  {
    id: 'M10',
    path: 'img/units/tenda-bara-interior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Tenda Bara, slide galeri 2, juga varian 4 pax',
    tag: '[MEDIA] Interior Tenda Bara, kasur queen, tiang kayu tengah, lampu badai menyala. Rasio 1:1.',
    subject:
      'Inside a cotton canvas bell tent after dark, shot from the doorway. The central timber pole runs up through the middle of the frame. A queen bed low on the raised timber floor, wool blankets layered and turned down on one side, a hot water bottle sitting on the pillow. A hurricane lamp hangs from a hook on the pole and is the only light source, throwing a warm pool across the bedding and up the canvas, with the tent edges falling into deep shadow. A canvas kit bag open on the floor, a jacket over the single wooden chair, one damp towel over the chair back.',
  },
  {
    id: 'M11',
    path: 'img/units/tenda-bara-dek.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Tenda Bara, slide galeri 3',
    tag: '[MEDIA] Api unggun pribadi menyala di depan Tenda Bara saat langit senja berubah ungu. Rasio 1:1.',
    subject:
      'A private fire burning in a stone ring in front of a canvas bell tent, shot low from the far side of the fire so the flame is in the near foreground and the lit tent sits behind it. The tent canvas glows warm on the side facing the fire and stays cool blue violet on the other. Above the tree line the sky has gone from amber to violet. Two people sit on a low log bench to the right, in jackets, out of focus, one holding a mug. Woodsmoke haze drifts through the frame. Sparks rising. No text anywhere.',
  },
  {
    id: 'M12',
    path: 'img/units/tenda-bara-detail.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Tenda Bara, slide galeri 4',
    tag: '[MEDIA] Detail tali pancang dan kanvas Tenda Bara dengan embun pagi. Rasio 1:1.',
    subject:
      'A very tight detail of the corner of a cotton canvas tent at 06.30. A guy line under visible tension runs from a brass eyelet down to a steel peg driven into wet red earth, the rope fibres and the slight fray at the knot clearly readable. Dew beads sit across the weave of the canvas, one drop about to run. The stitching and a small stain on the fabric are visible. Behind it everything falls soft: pine trunks and white mist, no detail. Cool blue shadow across the whole frame with one warm edge where early sun catches the rope.',
  },

  /* --------------------------------------- Kabin Lembayung, 4 frames ---------------------- */
  {
    id: 'M13',
    path: 'img/units/kabin-lembayung-eksterior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Kabin Lembayung, kartu unit dan slide galeri 1',
    tag: '[MEDIA] Kabin Lembayung, dek kayu panjang menghadap barat saat matahari turun di balik punggung bukit. Rasio 1:1.',
    subject:
      'A single storey timber cabin on the fourth terrace, photographed from the side so its nine metre west facing deck runs across the frame towards the open valley. Floor to ceiling glass along the west wall reflects the amber sky. The sun has just dropped behind the western ridge, leaving the ridge line black and the sky above it orange grading into violet. A wooden soaking tub sits at the far south end of the deck. Warm interior light is just coming on behind the glass. Pines frame the left edge of the frame. Mild lens flare where the last light clips the ridge.',
  },
  {
    id: 'M14',
    path: 'img/units/kabin-lembayung-interior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Kabin Lembayung, slide galeri 2, juga varian 4 pax',
    tag: '[MEDIA] Interior Kabin Lembayung, kasur king dan jendela kaca penuh menghadap lembah. Rasio 1:1.',
    subject:
      'The interior of a timber cabin at 17.40, shot from the doorway so the full height west facing glass fills the right of the frame and the amber and violet valley beyond is visible through it. A king bed with heavy linen, the near corner turned back, two books stacked on the side table. An electric fireplace glows low in the pale timber wall on the left. A coffee grinder and a bag of beans sit on the small counter, one mug already used. A cardigan over the arm of the chair. Warm interior light and cool valley light meeting across the floorboards.',
  },
  {
    id: 'M15',
    path: 'img/units/kabin-lembayung-dek.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Kabin Lembayung, slide galeri 3',
    tag: '[MEDIA] Bak rendam kayu di ujung dek Kabin Lembayung, uap air panas dan langit ungu jingga. Rasio 1:1.',
    subject:
      'A round timber soaking tub at the far end of a west facing cabin deck, filled with hot water and steaming heavily in cold highland air at 17.50. Shot at standing height from behind the tub so the steam, the deck rail and the amber to violet valley beyond are stacked in the frame. Two folded towels and two enamel mugs sit on the deck boards beside it. The timber of the tub is dark with water, one stave slightly stained. String bulbs on the deck rail have just come on, small and warm and out of focus. No people in the tub.',
  },
  {
    id: 'M16',
    path: 'img/units/kabin-lembayung-detail.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Kabin Lembayung, slide galeri 4',
    tag: '[MEDIA] Detail sudut dek Kabin Lembayung, dua mug enamel dan selimut wol di kursi kayu. Rasio 1:1.',
    subject:
      'A close detail of one corner of a timber deck at blue hour. Two enamel mugs sit on the flat top of the deck rail, one still half full with coffee and a faint ring dried on the timber beside it. A grey wool blanket is thrown over the arm of the wooden chair behind them, one corner hanging down. The deck boards are damp. Everything past the rail, the valley and the last violet band of sky, falls completely soft. A single warm string bulb sits out of focus at the top of the frame. No text, no labels.',
  },

  /* ----------------------------------------- Rumah Kanopi, 4 frames ---------------------- */
  {
    id: 'M17',
    path: 'img/units/rumah-kanopi-eksterior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Rumah Kanopi, kartu unit dan slide galeri 1',
    tag: '[MEDIA] Rumah panggung kayu di antara empat batang pinus, jembatan kayu ke pintunya. Rasio 1:1.',
    subject:
      'A small timber house on stilts standing 3,5 metres above the forest floor between four mature pine trunks, photographed from below and to the side in soft overcast light so both the four concrete columns and the trunks are clearly separate from each other. Nothing is bolted to the trees. An eleven metre timber walkway runs in from the high side of the slope on the left, with a simple handrail. Windows wrap three sides at canopy height. Ferns and pine litter on the ground beneath. Thin mist between the further trunks. No people in frame.',
  },
  {
    id: 'M18',
    path: 'img/units/rumah-kanopi-interior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Rumah Kanopi, slide galeri 2, juga varian 4 pax',
    tag: '[MEDIA] Interior Rumah Kanopi, meja kerja kayu menghadap jendela dan kanopi pinus di luar. Rasio 1:1.',
    subject:
      'Inside a timber stilt house at canopy height in the morning, shot over the shoulder of an empty chair towards a plain wooden desk set against a window. Through the window, pine branches at eye level and white mist moving past. On the desk an open laptop, a notebook with handwriting, a pen, a glass of water and a mug, plus a coiled charging cable. A jacket hangs on the back of the chair. Behind, the corner of a queen bed with the quilt pulled up untidily. Soft flat daylight from three sides, cool in the shadows, no artificial light on.',
  },
  {
    id: 'M19',
    path: 'img/units/rumah-kanopi-dek.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Rumah Kanopi, slide galeri 3',
    tag: '[MEDIA] Jembatan kayu menuju Rumah Kanopi, kabut lewat di ketinggian kanopi. Rasio 1:1.',
    subject:
      'An eleven metre timber walkway photographed from its near end, running level away from the camera between pine trunks towards the door of a stilt house. The boards are wet and dark, the simple handrail beaded with moisture. White mist is moving through the frame at deck height, thick enough that the house at the far end is softened and the ground below the walkway disappears entirely. Early overcast light from above. One damp footprint on the third board. A single pine cone resting against the rail post. No people, no signage.',
  },
  {
    id: 'M20',
    path: 'img/units/rumah-kanopi-detail.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Rumah Kanopi, slide galeri 4',
    tag: '[MEDIA] Detail tiang beton Rumah Kanopi yang berdiri terpisah dari batang pinus. Rasio 1:1.',
    subject:
      'A tight detail at ground level showing the base of one poured concrete column and, about 40 centimetres away from it, the base of a mature pine trunk with its bark texture and resin clearly readable. The gap between the two is the subject: nothing touches the tree, no bolt, no strap, no nail. Timber bearers run off the top of the column out of the frame. Wet red earth, pine needles and a few small ferns around the base. Cool diffused forest light. The trunk falls slightly soft while the concrete edge and the gap stay sharp.',
  },

  /* ------------------------------------------ Lodge Rimba, 4 frames ---------------------- */
  {
    id: 'M21',
    path: 'img/units/lodge-rimba-eksterior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Lodge Rimba, kartu unit dan slide galeri 1',
    tag: '[MEDIA] Lodge kayu memanjang di teras terendah dekat embung pada sore hari. Rasio 1:1.',
    subject:
      'A long single storey timber lodge on the lowest terrace in late afternoon light, photographed at a slight angle so the length of the building runs into the frame. Insulated metal roof, timber board walls, a covered walkway along the front with a poured concrete path leading to it. To the left, a small still reservoir reflecting the pine slope and the amber sky. Two folded trestle tables lean against the wall. A minibus is parked at the far end, small in frame. Wet concrete from an earlier shower. Pines rising behind the roof line. No signage in focus.',
  },
  {
    id: 'M22',
    path: 'img/units/lodge-rimba-interior.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Lodge Rimba, slide galeri 2, juga varian 12 pax',
    tag: '[MEDIA] Kamar bunk Lodge Rimba, tempat tidur susun kayu dan selimut wol terlipat. Rasio 1:1.',
    subject:
      'A bunk room in a timber lodge, shot down the length of the room so three sets of wooden bunk beds recede on the right. Each mattress carries a folded wool blanket at its foot, one already shaken out and used, a phone charging on the sill beside it. Simple timber ladders, a shelf rail along the wall with a few water bottles and a folded towel. Daylight comes in flat from windows on the left, no lamp on. Two backpacks on the floor between bunks. Visible scuffs on the floorboards and a small chip in the paint of one ladder.',
  },
  {
    id: 'M23',
    path: 'img/units/lodge-rimba-dek.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Lodge Rimba, slide galeri 3, juga varian 20 pax',
    tag: '[MEDIA] Ruang kumpul Lodge Rimba, meja panjang kayu dan rombongan sedang duduk mengobrol. Rasio 1:1.',
    subject:
      'The common room of a timber lodge, shot from one end of a long wooden table with benches down both sides. About ten Indonesian adults in casual jackets and lanyards sit along it in the middle of a conversation, some leaning in, one standing and mid gesture, natural skin texture and unstyled hair. Laptops, notebooks, paper cups and a large thermos across the table, cables running to sockets set into the table edge. A flip chart stands out of focus in the far corner, its writing illegible. Late afternoon light from the windows on the left.',
  },
  {
    id: 'M24',
    path: 'img/units/lodge-rimba-detail.jpg',
    ratio: '1:1',
    model: 'Nano Banana',
    slot: 'Lodge Rimba, slide galeri 4',
    tag: '[MEDIA] Detail meja panjang Lodge Rimba, colokan tertanam dan mug kopi. Rasio 1:1.',
    subject:
      'A close detail along the surface of a long timber table, shot low so the grain runs away from the camera and falls out of focus quickly. In the sharp near third, a recessed power outlet set flush into the timber with two plugs in it and cables running off the edge, plus a coffee mug with a dried ring beside it and a pencil. Scratches, one water mark and a small burn in the finish are all clearly visible. Beyond, benches and daylight from a window blur into soft shapes. No readable text on anything.',
  },

  /* ------------------------------------------------- packages, 5 rows -------------------- */
  {
    id: 'M25',
    path: 'img/packages/senja-berdua.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Paket Senja Berdua, kartu dan hero halaman paket',
    tag: '[MEDIA] Meja makan malam untuk dua orang di dek Kabin Lembayung, lampu gantung hangat, langit senja ungu. Rasio 4:3.',
    subject:
      'A table set for two on a west facing timber cabin deck at 17.50, shot from the side at seated height so the table, the deck rail and the valley are layered. Two places laid simply, a small arrangement of local cut flowers in a plain glass, two wine glasses, a covered dish. Warm string bulbs run along the rail just above, in focus at the near end and softening away. Behind, the ridge line black against an amber to violet sky. A wool blanket over one chair back. One handwritten card on the table, angled away and out of focus so no wording reads.',
  },
  {
    id: 'M26',
    path: 'img/packages/akhir-pekan-keluarga.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Paket Akhir Pekan Keluarga, kartu dan hero halaman paket',
    tag: '[MEDIA] Keluarga Indonesia mengelilingi api unggun, anak anak memanggang marshmallow saat senja. Rasio 4:3.',
    subject:
      'An Indonesian family of four around a stone fire ring at dusk, photographed from just outside the circle at seated height. Two children of about seven and ten hold long sticks out over the flame with marshmallows on the ends, the younger leaning back from the heat, the older concentrating. Both parents sit on the log bench behind, one laughing, one steadying a mug. All four in real jackets and beanies, natural skin texture, stray hair, unposed and mid movement. Firelight on their faces, cool violet sky and pine silhouettes behind. Woodsmoke haze. Corn cobs and a paper bag on the bench.',
  },
  {
    id: 'M27',
    path: 'img/packages/gathering-kantor.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Paket Gathering Kantor, kartu dan hero halaman paket',
    tag: '[MEDIA] Peserta gathering kantor mengikuti sesi di Aula Lembah yang beratap dengan dinding setengah terbuka. Rasio 4:3.',
    subject:
      'A session in progress inside a roofed hall with half open walls, shot from the back so rows of seated Indonesian office staff in casual shirts and lanyards fill the middle of the frame and the open side of the hall shows pine forest and afternoon light beyond. A facilitator stands at the front, mid gesture, small in frame. A projection screen stands at an angle to the camera, bright but with nothing readable on it. Canvas blinds are rolled up along the open wall. Steel frame trusses overhead, plastic chairs, cables taped to the floor. Nobody is looking at the camera.',
  },
  {
    id: 'M28',
    path: 'img/packages/outbound-sekolah.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Paket Outbound Sekolah, kartu dan hero halaman paket',
    tag: '[MEDIA] Siswa Indonesia mengikuti pos permainan tali di lereng pinus didampingi instruktur. Rasio 4:3.',
    subject:
      'Indonesian school students of about twelve working through a low rope obstacle strung between pine trunks on a sloped clearing, photographed from below the slope in flat morning light. Three students are on the ropes, one balancing with arms out, two waiting and watching. An instructor in a plain field jacket stands within arms reach of the student on the rope, hand raised ready to spot. Ten more students sit on the bank at the left of frame, some in school sports shirts, all unposed. Red earth and pine needles underfoot, a coil of rope and two helmets on the ground.',
  },
  {
    id: 'M29',
    path: 'img/packages/momen-spesial.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Paket Momen Spesial, kartu dan hero halaman paket',
    tag: '[MEDIA] Setup dekorasi lamaran di dek barat dengan bunga potong dan lampu gantung menghadap lembah senja. Rasio 4:3.',
    subject:
      'A small decorated setup on a west facing timber deck at 17.30, finished and completely empty of people. Two low arrangements of local cut flowers on stands either side of an open space at the deck edge, warm string bulbs looped along the rail and up one post, a low table with a covered cake stand and two glasses. The valley beyond is amber going violet, the ridge line black. Petals scattered lightly across damp deck boards, one blown to the corner. Everything readable in the frame, a card and the cake, is angled away and softly out of focus.',
  },

  /* --------------------------------------- activities and facilities, 8 rows ------------- */
  {
    id: 'M30',
    path: 'img/activities/api-unggun-lembayung.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Api Unggun Lembayung, kartu kegiatan dan hero bagian kegiatan',
    tag: '[MEDIA] Api unggun komunal di Plaza Bara dengan tamu duduk melingkar saat langit ungu jingga. Rasio 4:3.',
    subject:
      'A communal fire burning in a 2,5 metre ring of stacked stone on the lowest terrace at 17.35, photographed from outside the circle at standing height so the fire sits in the lower middle and the amber to violet valley fills the upper third. About fifteen Indonesian guests of mixed ages sit on the curved timber benches around it, in jackets, some talking, two children crouched forward, one man feeding a log in. Woodsmoke drifting left. Sparks. Two water buckets and one sand bucket sit at the near edge of the stone, clearly in frame. No signage.',
  },
  {
    id: 'M31',
    path: 'img/activities/trekking-bukit-kabut.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Trekking Pagi Bukit Kabut, kartu kegiatan',
    tag: '[MEDIA] Rombongan kecil di jalur trekking hutan pinus pada pagi hari dengan kabut rendah di lembah. Rasio 4:3.',
    subject:
      'Six Indonesian walkers in jackets on a narrow earth trail through a pine plantation at 06.15, photographed from behind and slightly below so the trail climbs away from the camera. A local guide leads, turning back to say something. Two walkers are still on the lower switchback. To the right the ground drops away and the whole valley below is filled with white mist, with a far ridge showing above it. Low sun rakes between the trunks and throws long shadows across the trail. Wet earth, exposed roots, one walker with mud on their boots. Grade well readable.',
  },
  {
    id: 'M32',
    path: 'img/activities/panahan-dan-air-rifle.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Panahan dan Air Rifle, kartu kegiatan',
    tag: '[MEDIA] Seorang anak belajar memanah didampingi instruktur, latar tebing tanah. Rasio 4:3.',
    subject:
      'An Indonesian child of about ten drawing a small recurve bow on a grass range, photographed from the side at their height so the bow, the drawn string and their concentrating face are all readable. An instructor in a plain field jacket kneels just behind, one hand near the childs elbow, correcting the stance. Twenty five metres away the target butts stand against a raw earth bank, small in frame and slightly soft. Late afternoon side light. Two more bows and a quiver of arrows rest on a wooden rack in the near foreground. Pines above the earth bank.',
  },
  {
    id: 'M33',
    path: 'img/activities/kebun-petik-stroberi.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Kebun Petik Stroberi, kartu kegiatan',
    tag: '[MEDIA] Tamu memetik stroberi di bedengan kebun pada pagi hari dengan terasering lama di latar. Rasio 4:3.',
    subject:
      'Two hands close in the frame picking a ripe strawberry from a mulched raised bed, the fruit and the stem and the pale plastic mulch sharp, a small woven basket already holding six berries beside them. The picker, an Indonesian woman in a jacket, is visible from the waist down and slightly out of focus above the hands. Behind her the beds run in rows along an old stepped terrace, with the stone retaining wall of the terrace above catching morning light. Wet soil, a few unripe white berries, one leaf with a hole in it. Soft overcast light.',
  },
  {
    id: 'M34',
    path: 'img/activities/dapur-bara.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Dapur Bara, kartu fasilitas',
    tag: '[MEDIA] Restoran kayu semi terbuka Dapur Bara dengan sisi barat menghadap lembah pada sore hari. Rasio 4:3.',
    subject:
      'A half open timber restaurant building in late afternoon, shot from inside near the entrance looking towards the fully open west wall and the amber valley beyond it. Plain timber tables and benches, about half of them occupied by Indonesian guests eating, nobody posing. In the near foreground one table sharp with a plate of rice, grilled chicken, a bowl of sambal and two glasses of iced tea on it. A grill station glows at the far right, a cook working, small in frame. A chalk written menu board hangs at the left, deliberately out of focus and unreadable.',
  },
  {
    id: 'M35',
    path: 'img/activities/bak-rendam-air-hangat.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Bak Rendam Kayu Air Hangat, kartu fasilitas',
    tag: '[MEDIA] Bak rendam kayu berisi air panas mengepul di teras terlindung dengan sekat kayu dan pinus. Rasio 4:3.',
    subject:
      'A round timber soaking tub full of hot water and steaming hard in cold air, photographed at standing height from the entrance of a screened bay. A 1,8 metre timber privacy screen runs along the right of the frame, its boards weathered and slightly gapped. Pine forest fills the space above and behind the screen. Two folded towels sit on a timber stool beside the tub with a small enamel jug. Beyond, a second screened bay is just visible and out of focus. Steam catches low late light. Water marks and a darkened stave on the tub. No people.',
  },
  {
    id: 'M36',
    path: 'img/activities/aula-lembah.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Aula Lembah, kartu fasilitas',
    tag: '[MEDIA] Aula Lembah beratap dengan dinding setengah terbuka, kursi tertata, hutan pinus dari sisi terbuka. Rasio 4:3.',
    subject:
      'An empty roofed hall with half open walls, shot from the front corner so the depth of the room, the steel roof trusses and the fully open long side are all in frame. Rows of plastic chairs set out theatre style, straightened but not perfectly aligned. Canvas blinds rolled up along the open wall, ties hanging. Through that opening, pine forest and flat overcast highland light. Two speakers on stands and a projection screen at the near end, the screen blank and angled away from the camera. Cables taped along the concrete floor, one chair out of line.',
  },
  {
    id: 'M37',
    path: 'img/activities/pos-bintang.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Pos Bintang, kartu fasilitas',
    tag: '[MEDIA] Dek pandang Pos Bintang tanpa lampu pada malam berbintang dengan satu teleskop. Rasio 4:3.',
    subject:
      'An unlit timber viewing deck at the highest point of the property on a clear night, shot from the top of the approach path. A single reflector telescope on a tripod stands near the far rail, in silhouette. The sky above fills most of the frame with a dense star field and the Milky Way clearly across it. Ankle height red path markers glow faintly along the near edge of the deck, the only artificial light in frame. Pine silhouettes on both sides. One person stands at the rail, a dark shape against the sky, not identifiable. Deck boards damp.',
  },

  /* ---------------------------------------------- article covers, 6 rows ----------------- */
  {
    id: 'M38',
    path: 'img/articles/membaca-cuaca-lembang.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Artikel Cara Membaca Cuaca Lembang, kover',
    tag: '[MEDIA] Kabut tebal bergerak melewati tegakan pinus Lembang pada sore hari menjelang hujan. Rasio 16:9.',
    subject:
      'Thick cloud pouring downhill through a pine plantation on a late afternoon before rain, shot wide from a clearing on the slope. The near trunks are sharp and dark, the ones twenty metres back are already half dissolved, and the far ones are gone entirely. Grey light with no visible sun and no shadows. Wet needles and red earth in the near foreground, a puddle holding the pale sky. The ridge line above the trees is completely hidden. Cool blue grey throughout with one faint warm break at the far left edge. No people, no buildings, no signage.',
  },
  {
    id: 'M39',
    path: 'img/articles/bawa-anak-ke-glamping.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Artikel Bawa Anak ke Glamping, kover',
    tag: '[MEDIA] Anak kecil berjaket tebal duduk di dek kabin pada pagi berkabut sambil memegang mug. Rasio 16:9.',
    subject:
      'An Indonesian child of about six sitting on the edge of a timber cabin deck at 06.45, wrapped in a thick fleece jacket with the hood up, holding a large enamel mug in both hands and looking out rather than at the camera. Shot from the side at their height, wide, so the deck runs out of frame to the left and the misted pine valley fills the right. Thick socks and no shoes, one small trainer lying on its side beside them. Dew on the boards. A wool blanket half fallen off their shoulder. Soft flat morning light.',
  },
  {
    id: 'M40',
    path: 'img/articles/kenapa-senja-berwarna-ungu.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Artikel Kenapa Senja di Lembang Berwarna Ungu, kover',
    tag: '[MEDIA] Langit senja ungu dan jingga di atas lembah Bandung dilihat dari punggung bukit Lembang. Rasio 16:9.',
    subject:
      'A wide landscape from a highland ridge at 17.55, looking west over a broad valley. The sun is already gone behind the far ridge, which reads as a flat black band across the lower third. Above it the sky runs amber at the horizon through a narrow terracotta band into a deep violet at the top of the frame, with a few high thin clouds catching light and giving the gradient visible layers rather than a flat wash. Far city lights just beginning in the valley floor, tiny. Pine branches in silhouette across the top left corner. No people, no structures.',
  },
  {
    id: 'M41',
    path: 'img/articles/rundown-gathering-kantor.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Artikel Panduan Gathering Kantor, kover',
    tag: '[MEDIA] Peserta gathering kantor berkumpul di lapangan lereng pada pagi hari untuk sesi outbound. Rasio 16:9.',
    subject:
      'About thirty Indonesian office staff standing loosely in a circle on a sloped grass clearing at 08.40, shot wide from above and to the side so the slope and the pine wall behind are both readable. Casual clothes and a few matching event shirts, several with lanyards. A facilitator stands in the middle of the circle, arms out, mid instruction. Some participants are laughing, two are still walking in from the right edge of frame, nobody is looking at the camera. Flat morning light, dew still on the grass, a coil of rope and two cones on the ground.',
  },
  {
    id: 'M42',
    path: 'img/articles/api-unggun-aman.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Artikel Api Unggun yang Aman, kover',
    tag: '[MEDIA] Lingkar batu api unggun di Plaza Bara dengan bangku kayu melingkar dan ember air di sisinya. Rasio 16:9.',
    subject:
      'A stone fire ring at blue hour with the fire burning low and steady, photographed wide and slightly from above so the whole safety arrangement is legible: the 2,5 metre ring of stacked stone, the swept clear ground around it, the curved timber benches set well back, and in the sharp near foreground two galvanised buckets of water and one of sand standing together on the stone edge. A long metal poker leans against the bench. Split dry pine stacked neatly to one side. No people in frame. Deep violet sky above the pine silhouettes, warm fire light below.',
  },
  {
    id: 'M43',
    path: 'img/articles/rute-ke-lembayung.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Artikel Rute ke Lembayung, kover',
    tag: '[MEDIA] Jalan menanjak berbatu di antara tegakan pinus Cikole dengan papan penunjuk arah kayu. Rasio 16:9.',
    subject:
      'A narrow climbing track surfaced in loose stone running up between pine trunks, photographed wide from the bottom of the rise so the gradient and the rough surface are both obvious. Ruts, embedded rocks and a wet patch of red earth in the near foreground. A simple weathered timber direction board is mounted on a post at the right edge of frame, angled away from the camera and thrown out of focus so that no lettering on it can be read. Late afternoon light through the trunks with mild flare. A single car in the far distance, small and soft.',
  },

  /* ------------------------------------------ property wide, 3 rows ---------------------- */
  {
    id: 'M44',
    path: 'img/properti/aerial-teras.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Hero halaman Tentang, dan bagian lima teras di beranda',
    tag: '[MEDIA] Pandangan tinggi lima teras berundak dengan dome dan kabin tersebar, lembah di bawah. Rasio 16:9.',
    subject:
      'A high wide view across a terraced pine slope in the late afternoon, taken from an elevated point on the ridge rather than straight down, so the five stepped terraces read clearly one below the other with their old stone retaining walls. Domes on the second terrace, A frame cabins on the third, a long low lodge and a small reservoir on the lowest. Stone paths and steps connect them. Mature pines through and above the whole property. The Bandung valley opens amber beyond the lowest terrace. Thin smoke rising from one point. No text, no signage anywhere.',
  },
  {
    id: 'M45',
    path: 'img/properti/plaza-bara-senja.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Bagian ritual jam 17.30 di beranda, dan hero halaman Kegiatan',
    tag: '[MEDIA] Plaza Bara jam setengah enam, api baru menyala dan lembah berubah jingga lalu ungu. Rasio 16:9.',
    subject:
      'The fire plaza at exactly the moment the sky turns, shot very wide from behind and above the seating so the fire, the guests and the whole valley are in one frame. The fire has just been lit and the flame is still low and bright. Guests are still arriving down the stone steps on the left, others already seated on the curved benches, all in jackets, all in silhouette or half lit. The far ridge is black, the valley amber, the sky above it running orange into violet. Woodsmoke drifting across the lower frame. Water buckets visible at the stone edge.',
  },
  {
    id: 'M46',
    path: 'img/properti/gerbang-resepsionis.jpg',
    ratio: '4:3',
    model: 'Nano Banana',
    slot: 'Halaman Lokasi dan Kontak, foto kedatangan',
    tag: '[MEDIA] Gerbang kayu dan meja resepsionis kecil di ujung jalan berbatu, satu papan nama bertuliskan Lembayung. Rasio 4:3.',
    subject:
      'The arrival point of a highland glamping property in late afternoon light, shot from the end of a stone surfaced track. A simple timber gate frame spans the track, and mounted flat on its left post is one small dark timber sign carrying a single sharp word: Lembayung. That is the ONLY legible text in the frame and it is spelled exactly Lembayung, nine letters, capital L. No second line, no tagline, no category line, no arrow, no numbers on the sign. Behind the gate a small open reception desk under a shingle roof, a staff member in a plain jacket standing at it out of focus, and pines rising. A parked car at the right edge, soft.',
  },

  /* ------------------------------------------- Open Graph share image -------------------- */
  {
    id: 'M47',
    path: 'og-lembayung.jpg',
    ratio: '16:9',
    model: 'Nano Banana',
    slot: 'Gambar Open Graph dan Twitter card, 1200 kali 630',
    tag: '[MEDIA] Gambar bagikan 1200x630, dome dan kabin di lereng berundak saat langit ungu jingga, tanpa tulisan. Rasio 16:9.',
    subject:
      'A single wide establishing frame built to survive being cropped and shown small, at 1200 by 630. Shot at 17.40 from the third terrace looking west. In the near left, one canvas dome on its timber deck with a warm lamp already on inside it. In the middle distance, two A frame cabins stepping down the slope. Beyond them the black ridge line and the Bandung valley in amber, with the sky running orange into deep violet across the top half of the frame. Pines framing the right edge. Strong simple shapes, high contrast, and absolutely no text, no logo and no signage anywhere in frame.',
  },
];

/** Fast lookup for the annotated placeholder text. Keys are stored without a leading slash. */
const BY_PATH = new Map(MEDIA.map((m) => [m.path.replace(/^\//, ''), m]));

/**
 * The one line placeholder caption for a slot.
 *
 * Falls back to a visible, honest marker rather than an empty box if a page ever asks for a path
 * the manifest does not carry, because a silently blank placeholder is how a missing asset gets
 * past a review.
 */
export function mediaTag(path: string): string {
  const row = BY_PATH.get(path.replace(/^\//, ''));
  return row ? row.tag : `[MEDIA BELUM ADA DI MEDIA.md] ${path}`;
}

export function mediaRow(path: string): MediaRow | undefined {
  return BY_PATH.get(path.replace(/^\//, ''));
}
