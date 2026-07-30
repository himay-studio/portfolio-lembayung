/* Announcement bar.
 *
 * R52(a): this is the topmost of the three mobile layers, and the stacking order is explicit and
 * non overlapping: announcement bar, then topbar, then content. It is a normal flow element, not
 * fixed, so it cannot overlap the sticky header underneath it. It is tested at 375px together
 * with the topbar, the welcome modal and the WhatsApp oval all active at once, because the
 * HIM-228 defect was born from the combination while each component looked sane alone.
 *
 * --lembayung ground with --putih text is 10,25:1.
 */

import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <div className="announce">
      <div className="wrap">
        <span>Api unggun dinyalakan setiap sore jam 17.30, tepat saat lembah berubah warna.</span>
        <Link href="/kegiatan/#api-unggun-lembayung">Lihat jadwalnya</Link>
      </div>
    </div>
  );
}
