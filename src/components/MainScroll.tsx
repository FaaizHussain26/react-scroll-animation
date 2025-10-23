/* eslint-disable @typescript-eslint/no-explicit-any */
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";
import { items } from "../utils/items";

gsap.registerPlugin(ScrollTrigger);

function MainScroll() {
  const rowRefs = useRef<{ [key: string]: HTMLElement }>({});
  const triggersRef = useRef([]);
  const lenisRef = useRef<Lenis | null>(null);

  const createRowAnimation = (
    rowId: string,
    threshold: number,
    onThresholdReached: () => void,
    isLastRow: boolean = false
  ) => {
    const row = rowRefs.current[rowId];
    if (!row) {
      return;
    }

    let thresholdReached = false;

    const trigger = ScrollTrigger.create({
      trigger: row,
      start: "top 80%",
      end: "bottom 20%",
      scrub: isLastRow ? 0.1 : 0.5,
      onUpdate: (self) => {
        const newSize = 20 + self.progress * 50;
        const newHeight = 300 + self.progress * 300;

        row.style.setProperty("--cell-size", newSize + "%");
        row.querySelectorAll(".holder-img").forEach((cell: any) => {
          cell.style.setProperty("--cell-height", newHeight + "px");
          cell.style.height = newHeight + "px";
        });

        if (
          threshold &&
          newSize >= threshold &&
          !thresholdReached &&
          onThresholdReached
        ) {
          thresholdReached = true;
          onThresholdReached();
        }

        if (self.progress >= 0.5 && !thresholdReached && onThresholdReached) {
          thresholdReached = true;
          onThresholdReached();
        }
      },
    });

    triggersRef.current.push(trigger as never);
  };

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

    lenisRef?.current?.on("scroll", ScrollTrigger.update);

    const totalRows = Object.keys(items).length;
    const startedRows = new Set<string>();

    const thresholds = [50, 45, 40, 38, 35, 20];

    const startNextRow = (currentRowIndex: number) => {
      if (currentRowIndex >= totalRows) {
        return;
      }

      const rowId = `row-${currentRowIndex + 1}`;
      const threshold = thresholds[currentRowIndex] || 30;

      const rowElement = rowRefs.current[rowId];
      if (!rowElement) {
        console.log(`Row element ${rowId} not found, retrying...`);
        setTimeout(() => startNextRow(currentRowIndex), 100);
        return;
      }

      if (!startedRows.has(rowId)) {
        startedRows.add(rowId);
        console.log(`Creating animation for ${rowId}`);

        const delay = currentRowIndex === totalRows - 1 ? 200 : 0;

        setTimeout(() => {
          createRowAnimation(
            rowId,
            threshold,
            () => {
              startNextRow(currentRowIndex + 1);
            },
            currentRowIndex === totalRows - 1
          );
        }, delay);
      }
    };

    setTimeout(() => {
      startNextRow(0);

      setTimeout(() => {
        if (startedRows.size === totalRows) {
          console.log("Fallback: Forcing completion of last row animation");
          const lastRowIndex = totalRows - 1;
          const lastRowId = `row-${lastRowIndex + 1}`;
          console.log(
            `All rows animation completed! (fallback for ${lastRowId})`
          );
        }
      }, 10000);
    }, 100);

    return () => {
      triggersRef.current.forEach((trigger: any) => trigger?.kill());
      triggersRef.current = [];
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return (
    <div id="grid_projects">
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
                <img
                  src={item.image}
                  alt={`Image ${item.id}`}
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default React.memo(MainScroll);
