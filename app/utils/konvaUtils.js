'use es6';

export function hitCheck(shape1, shape2) {
  const s1 = shape1.getClientRect(); // use this to get bounding rect for shapes other than rectangles.
  const s2 = shape2.getClientRect();

  // corners of shape 1
  const X = s1.x;
  const Y = s1.y;
  const A = s1.x + s1.width;
  const B = s1.y + s1.height;

  // corners of shape 2
  const X1 = s2.x;
  const A1 = s2.x + s2.width;
  const Y1 = s2.y;
  const B1 = s2.y + s2.height;

  // Simple overlapping rect collision test
  if (A < X1 || A1 < X || B < Y1 || B1 < Y) {
    return false;
  }
  return true;
}

export function getRectFromPoints(posStart, posNow) {
  return reverse(posStart, posNow);
}

export function getItemsInHitBox(hitBoxShape, shapeList) {
  const itemsInHitBox = [];

  for (let i = 0; i < shapeList.length; i += 1) {
    if (hitCheck(hitBoxShape, shapeList[i])) {
      itemsInHitBox.push(shapeList[i]);
    }
  }
  return itemsInHitBox;
}

export function updateDrag(
  posIn,
  boundingBoxRef,
  shapeList,
  boundingBoxProps,
  updateBoundingBox,
) {
  const { posStart } = boundingBoxProps;
  if (!posStart) return null;
  // update rubber rect position
  const posNow = { x: posIn.x, y: posIn.y };
  const posRect = reverse(posStart, posNow);

  updateBoundingBox({
    ...boundingBoxProps,
    visible: true,
    height: posRect.y2 - posRect.y1,
    width: posRect.x2 - posRect.x1,
    x: posRect.x1,
    y: posRect.y1,
    stroke: '#1D82A5',
  });
  return null;
}

// reverse co-ords if user drags left / up
export function reverse(r1, r2) {
  let r1x = r1.x;
  let r1y = r1.y;
  let r2x = r2.x;
  let r2y = r2.y;
  let d;
  if (r1x > r2x) {
    d = Math.abs(r1x - r2x);
    r1x = r2x;
    r2x = r1x + d;
  }
  if (r1y > r2y) {
    d = Math.abs(r1y - r2y);
    r1y = r2y;
    r2y = r1y + d;
  }
  return { x1: r1x, y1: r1y, x2: r2x, y2: r2y }; // return the corrected rect.
}
