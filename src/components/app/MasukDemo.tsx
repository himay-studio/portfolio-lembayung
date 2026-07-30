'use client';

/**
 * Demo login.
 *
 * R14 note, because this is exactly the button people wire to WhatsApp by reflex: this form is
 * a WORKING FEATURE DEMO, not a sales CTA. Its job is to submit and land the visitor in the
 * panel, so it stays functional. The rule's own wording draws the line there: a button that
 * converts the visitor becomes a WhatsApp lead, a button that demonstrates a working feature
 * stays functional.
 *
 * The credentials are printed on the screen and prefilled, because a demo that makes a
 * prospective client guess a password is a demo nobody finishes. Editing either field and
 * submitting still exercises the real error path.
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { KREDENSIAL, useSesi } from './session';

export default function MasukDemo() {
  const router = useRouter();
  const { sesi, siap, masuk, keluar } = useSesi();
  const [email, setEmail] = useState(KREDENSIAL.email);
  const [sandi, setSandi] = useState(KREDENSIAL.sandi);
  const [galat, setGalat] = useState('');

  const kirim = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== KREDENSIAL.email || sandi !== KREDENSIAL.sandi) {
      setGalat('Surel atau kata sandi tidak cocok. Gunakan kredensial demo yang tertulis di atas.');
      return;
    }
    setGalat('');
    masuk();
    router.push('/app/');
  };

  return (
    /* `on-dark` sits on the LEFT COLUMN ONLY, never on the section. The login card is a white
       box inside this dark section, and site.css hangs real colour rules off `.on-dark`
       (`.field-label` goes to --kanvas, the focus ring goes amber, `.muted` goes to --kabut).
       With the class on the section those rules reach into the white card: measured before this
       change, `.field-label` rendered rgb(247,243,236) on rgb(255,255,255) at 1,11:1 on
       /app/masuk/. Scoping the class to the ground it actually describes fixes it at the source
       rather than fighting it with a more specific override. */
    <div className="app-masuk">
      <div className="on-dark">
        <h1 className="app-judul">Masuk ke panel</h1>
        <span className="app-sub">
          Halaman masuk demo untuk panel reservasi Lembayung. Tidak ada server dan tidak ada data tamu
          sungguhan di balik layar ini, jadi kredensialnya ditulis terbuka di sebelah kanan.
        </span>

        <ul className="app-list" style={{ marginTop: '1.25rem' }}>
          <li className="app-kecil" style={{ color: 'var(--kabut)' }}>
            Setelah masuk, nama dan peran Anda muncul di topbar dan di sidebar panel.
          </li>
          <li className="app-kecil" style={{ color: 'var(--kabut)' }}>
            Panel tetap bisa dibuka tanpa masuk, karena ini demo portofolio yang memang untuk dilihat.
          </li>
          <li className="app-kecil" style={{ color: 'var(--kabut)' }}>
            Sesi disimpan di peramban Anda sendiri dan bisa dihentikan kapan saja lewat tombol keluar.
          </li>
        </ul>

        <div className="app-baris" style={{ marginTop: '1.25rem' }}>
          <Link href="/app/" className="btn btn-outline-inv btn-sm">
            Buka panel tanpa masuk
          </Link>
          <Link href="/app/portal/" className="btn btn-ghost-inv btn-sm">
            Lihat portal tamu
          </Link>
        </div>
      </div>

      <div className="app-masuk-kartu">
        <p className="app-kredensial">
          <b>Kredensial demo</b>
          Surel <code>{KREDENSIAL.email}</code>
          <br />
          Kata sandi <code>{KREDENSIAL.sandi}</code>
          <br />
          Keduanya sudah terisi di bawah, tinggal tekan Masuk.
        </p>

        {siap && sesi.masuk ? (
          <>
            <h2 style={{ fontSize: '1.25rem' }}>Anda sudah masuk</h2>
            <p className="app-kecil">
              Sesi aktif sebagai {sesi.nama}, {sesi.peran.toLowerCase()}. Buka panel untuk melanjutkan
              atau hentikan sesi ini.
            </p>
            <div className="app-baris">
              <Link href="/app/" className="btn btn-violet btn-sm">
                Buka panel reservasi
              </Link>
              <button type="button" className="btn btn-outline btn-sm" onClick={keluar}>
                Keluar dari sesi
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={kirim} noValidate>
            {galat && (
              <div className="app-galat" role="alert">
                {galat}
              </div>
            )}

            <div className="stack">
              <div className="field">
                <label className="field-label" htmlFor="masuk-email">
                  Surel
                </label>
                <input
                  id="masuk-email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@lembayung.id"
                  autoComplete="username"
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="masuk-sandi">
                  Kata sandi
                </label>
                <input
                  id="masuk-sandi"
                  className="input"
                  type="password"
                  value={sandi}
                  onChange={(e) => setSandi(e.target.value)}
                  placeholder="Kata sandi demo"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="app-baris" style={{ marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-violet">
                Masuk
              </button>
              <Link href="/app/" className="btn btn-ghost btn-sm">
                Lewati
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
