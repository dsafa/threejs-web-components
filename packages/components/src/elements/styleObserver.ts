import StyleObserver from "style-observer";
import type { IBaseElement } from "./IBaseElement";

interface Options {
  element: IBaseElement;
  properties: string[];
  onUpdate: (property: string, value: string) => void;
  signal: AbortSignal;
}

export const createStyleObserver = ({
  element,
  onUpdate: onUpdateParam,
  properties,
  signal,
}: Options) => {
  const propertyValues = new Map<string, string>();

  const onUpdate = (property: string, value: string) => {
    if (propertyValues.get(property) === value) {
      return;
    }

    propertyValues.set(property, value);
    onUpdateParam(property, value);
  };

  const observer = new StyleObserver((records) => {
    for (const record of records) {
      onUpdate(record.property, record.value);
    }
  });

  observer.observe(element, properties);

  signal.addEventListener(
    "abort",
    () => {
      observer.unobserve(element);
    },
    { once: true }
  );

  const syncElementStyles = () => {
    const styles = window.getComputedStyle(element);
    for (const property of properties) {
      onUpdate(property, styles.getPropertyValue(property));
    }
  };

  let isAnimating = element
    .getAnimations()
    .some((animation) => animation.playState === "running");

  const context = element.getRootContext();

  context?.addEventListener(
    "render-start",
    ({ markUpdated }) => {
      if (isAnimating) {
        markUpdated();
      }
    },
    { signal }
  );

  const observeAnimation = () => {
    syncElementStyles();

    context?.queueRender();

    if (isAnimating) {
      window.requestAnimationFrame(observeAnimation);
    }
  };

  observeAnimation();

  element.addEventListener(
    "animationstart",
    () => {
      isAnimating = true;
      observeAnimation();
    },
    { signal }
  );

  element.addEventListener(
    "animationend",
    () => {
      isAnimating = false;
    },
    { signal: signal }
  );

  element.addEventListener(
    "animationend",
    () => {
      isAnimating = false;
    },
    { signal: signal }
  );
};
