/**
 * The controls every stepped diagram in the series shares: two buttons, a
 * live label and the dots. It owns the index and the disabled states and
 * knows nothing about what the diagram does with a step.
 */
export interface StepperOptions {
  root: HTMLElement;
  steps: string[];
  onStep: (index: number, previous: number) => void;
}

export interface Stepper {
  destroy(): void;
}

export function mountStepper({ root, steps, onStep }: StepperOptions): Stepper {
  const label = root.querySelector<HTMLElement>("[data-step-label]");
  const prev = root.querySelector<HTMLButtonElement>("[data-step-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-step-next]");
  const dots = [...root.querySelectorAll<HTMLElement>("[data-dots] span")];

  if (!label || !prev || !next) return { destroy() {} };

  let at = 0;

  const show = (index: number) => {
    const previous = at;
    at = Math.max(0, Math.min(steps.length - 1, index));
    label.textContent = steps[at] ?? "";
    prev.disabled = at === 0;
    next.disabled = at === steps.length - 1;
    dots.forEach((dot, i) => dot.toggleAttribute("data-on", i === at));
    onStep(at, previous);
  };

  const back = () => show(at - 1);
  const forward = () => show(at + 1);

  prev.addEventListener("click", back);
  next.addEventListener("click", forward);
  show(0);

  return {
    destroy() {
      prev.removeEventListener("click", back);
      next.removeEventListener("click", forward);
    },
  };
}

/** Both animation paths read motion from the same custom properties. */
export function motion(el: Element) {
  const cs = getComputedStyle(el);
  const ms = (name: string) => parseFloat(cs.getPropertyValue(name)) || 300;
  const curve = (name: string): [number, number, number, number] => {
    const n = cs.getPropertyValue(name).match(/-?[\d.]+/g);
    return n && n.length === 4
      ? [+n[0], +n[1], +n[2], +n[3]]
      : [0.4, 0, 0.2, 1];
  };
  return {
    fast: ms("--dia-dur-fast"),
    draw: ms("--dia-dur-draw"),
    settle: ms("--dia-dur-settle"),
    stagger: ms("--dia-stagger"),
    standard: curve("--dia-ease-standard"),
    enter: curve("--dia-ease-enter"),
    colour: (name: string) => cs.getPropertyValue(name).trim(),
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}
