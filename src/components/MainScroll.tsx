/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import React from 'react';
import { items } from '../utils/items';



// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function MainScroll() {
  const rowRefs = useRef<{ [key: string]: HTMLElement }>({});
  const triggersRef = useRef([]);
  const lenisRef = useRef<Lenis | null>(null);

  const createRowAnimation = useCallback((rowId: string, threshold: number, onThresholdReached: () => void) => {
    const row = rowRefs.current[rowId];
    if (!row) return;

    const trigger = ScrollTrigger.create({
      trigger: row,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.5,
      onUpdate: (self) => {
        const newSize = 20 + self.progress * 50;
        const newHeight = 300 + self.progress * 200;

        row.style.setProperty('--cell-size', newSize + '%');
        row.querySelectorAll('.holder-img').forEach((cell: any) => {
          cell.style.setProperty('--cell-height', newHeight + 'px');
          cell.style.height = newHeight + 'px';
        });

        if (threshold && newSize >= threshold && onThresholdReached) {
          onThresholdReached();
        }
      },
    });

    triggersRef.current.push(trigger as never);
  }, [triggersRef]);


  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenisRef.current = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenisRef?.current?.on('scroll', ScrollTrigger.update);

    // Animation state
    let row2Started = false;
    let row3Started = false;
    let row4Started = false;
    let row5Started = false;

    // Row animation function

    createRowAnimation('row-1', 50, () => {
      if (!row2Started) {
        row2Started = true;
        createRowAnimation('row-2', 45, () => {
          if (!row3Started) {
            row3Started = true;
            createRowAnimation('row-3', 40, () => {
              if (!row4Started) {
                row4Started = true;
                createRowAnimation('row-4', 38, () => {
                  if (!row5Started) {
                    row5Started = true;
                    createRowAnimation('row-5', 35, () => {});
                  }
                });
              }
            });
          }
        });
      }
    });

    return () => {
      triggersRef.current.forEach((trigger: any) => trigger?.kill());
      triggersRef.current = [];
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return (
    <div id="grid_projects" >
      <div className="">
        {Object.entries(items).map(([rowKey, rowItems], index) => (
          <div
            className="grid-row"
            id={`row-${index + 1}`}
            key={rowKey}
            ref={(el) => (rowRefs.current[`row-${index + 1}`] = el as any)}
          >
            {rowItems.map((item) => (
              <div className="holder-img" key={item.id}>
                <a href="#">
                  <img src={item.image} alt={`Image ${item.id}`} loading="lazy" />
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(MainScroll);