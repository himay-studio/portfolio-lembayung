'use client';

/* FAQ accordion, R7.
 *
 * R60: `aria-expanded` is driven by the SAME state the CSS `.is-open` class reads, so the reported
 * state can never disagree with what is rendered. There is no `:hover` or `:focus-within` CSS rule
 * opening a panel behind the state's back.
 * R12 family: the panel animates with a grid-template-rows 0fr to 1fr transition plus a rotating
 * chevron, and it is fully keyboard operable because the trigger is a real button.
 * R48: a collapsed accordion is NOT a card stack, so this list is exempt from the mobile carousel
 * rule. It still needs full keyboard operation and honest state, which is what it has.
 */

import { useState } from 'react';
import type { FaqItem } from '@/data/types';

export default function FaqAccordion({ items, idBase = 'faq' }: { items: FaqItem[]; idBase?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="reveal">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${idBase}-panel-${i}`;
        const triggerId = `${idBase}-trigger-${i}`;
        return (
          <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.question}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={triggerId}
                className="faq-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.question}</span>
                <span className="nav-caret" aria-hidden="true" />
              </button>
            </h3>
            <div className="faq-panel" id={panelId} role="region" aria-labelledby={triggerId}>
              <div>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
