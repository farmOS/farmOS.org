import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function computeVisibility(headingElement) {
  const result = { bb: null, isVisible: false };
  if (!(headingElement instanceof HTMLElement)) return result;
  result.bb = headingElement.getBoundingClientRect();
  const { top, left, bottom, right } = result.bb;
  result.isVisible = top >= 0
    && left >= 0
    && bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && right <= (window.innerWidth || document.documentElement.clientWidth);
  return result;
}

function findTopVisible(headingMap) {
  const visible = [];
  headingMap.forEach((heading) => {
    const { isVisible, bb } = computeVisibility(heading.h);
    if (isVisible) visible.push({ ...heading, ...bb });
  });
  visible.sort((a, b) => a.top - b.top);
  return visible[0];
}

export default function useActiveHeading(headings = [], activeClassName = '') {
  const ref = useRef(null);
  const [currentId, setCurrentId] = useState(headings[0]);
  const headingsMap = useMemo(
    () => new Map(headings.map(id => [id, { id }])),
    [headings],
  );
  const setActiveHeading = useCallback(() => {
    const topVisible = findTopVisible(headingsMap);
    if (currentId && topVisible && topVisible.id !== currentId) {
      headingsMap.get(currentId).a.classList.remove(activeClassName);
    }
    if (topVisible && topVisible.id !== currentId) {
      setCurrentId(topVisible.id);
      topVisible.a.classList.add(activeClassName);
    }
  }, [activeClassName, currentId, headingsMap]);
  useEffect(() => {
    const firstAnchor = ref && ref.current.querySelector(`a[href="#${currentId}"]`);
    if (firstAnchor) {
      firstAnchor.classList.add(activeClassName);
    }
    const observer = new IntersectionObserver(setActiveHeading);
    headingsMap.forEach((elements, id) => {
      elements.h = document.getElementById(id);
      elements.a = ref && ref.current.querySelector(`a[href="#${id}"]`);
      observer.observe(elements.h);
    });
    return () => {
      headingsMap.forEach(({ h }) => { observer.unobserve(h); });
    };
  }, [activeClassName, ref, currentId, headingsMap, setActiveHeading]);

  return [ref, () => setActiveHeading()];
}
