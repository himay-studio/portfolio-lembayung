'use client';

/**
 * Demo session for the panel.
 *
 * There is no backend and no real authentication: this is a static export and the site is a
 * portfolio demo. What this DOES need to be is honest about that, so the panel is readable
 * without signing in, the login screen shows its own credentials on screen, and signing in
 * changes the identity shown in the topbar and the sidebar rather than unlocking hidden data.
 *
 * Nothing here is read during render. `useSesi` starts from the signed out value on both the
 * server and the client and syncs from localStorage in an effect, so a statically prerendered
 * page and its hydration can never disagree.
 */

import { useCallback, useEffect, useState } from 'react';

const KEY = 'lembayung_app_sesi';

export interface Sesi {
  masuk: boolean;
  nama: string;
  peran: string;
  email: string;
}

export const TAMU_SESI: Sesi = {
  masuk: false,
  nama: 'Pengunjung demo',
  peran: 'Mode lihat saja',
  email: '',
};

/** Shown on the login screen itself, per the brief: demo credentials visible on screen. */
export const KREDENSIAL = {
  email: 'resepsionis@lembayung.id',
  sandi: 'senja1730',
  nama: 'Rani Anggraeni',
  peran: 'Resepsionis',
};

export function useSesi() {
  const [sesi, setSesi] = useState<Sesi>(TAMU_SESI);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSesi(JSON.parse(raw) as Sesi);
    } catch {
      /* private mode or corrupted value, stay signed out */
    }
    setSiap(true);
  }, []);

  const masuk = useCallback(() => {
    const next: Sesi = {
      masuk: true,
      nama: KREDENSIAL.nama,
      peran: KREDENSIAL.peran,
      email: KREDENSIAL.email,
    };
    setSesi(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const keluar = useCallback(() => {
    setSesi(TAMU_SESI);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { sesi, siap, masuk, keluar };
}
