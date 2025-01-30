class Pagination {
  static limit = 5;

  static init(req) {
    if (!req.pagination) req.pagination = {};
  }
  static setPaginationProps(req, _, next) {
    Pagination.init(req);
    ["limit"].forEach((prop) => {
      req.pagination[prop] = Pagination[prop];
    });
    next();
  }
  static getMidOffset(paginationProps, oldMedOffset) {
    const {
      from = 1,
      to = Pagination.limit,
      limit = Pagination.limit,
    } = paginationProps || {};
    const minMidOffset = from + Math.floor(limit / 2);
    const maxMidOffset = to - Math.floor(limit / 2);
    const newMidOffset =
      oldMedOffset < minMidOffset
        ? minMidOffset
        : oldMedOffset > maxMidOffset
        ? maxMidOffset
        : oldMedOffset;
    return { newMidOffset, maxMidOffset, minMidOffset };
  }
  static getNextOffset(paginationProps, oldOffset) {
    const {
      from = 1,
      to = Pagination.limit,
      limit = Pagination.limit,
      isMidOffset,
    } = paginationProps || {};
    if (oldOffset < from || oldOffset > to) return -1;
    let newOffset = oldOffset + limit;

    if (isMidOffset) {
      const midOffsetProps = Pagination.getMidOffset(
        paginationProps,
        oldOffset
      );
      oldOffset = midOffsetProps.newMidOffset;
      newOffset = oldOffset + limit;

      if (newOffset > to) {
        return oldOffset < midOffsetProps.maxMidOffset
          ? midOffsetProps.maxMidOffset
          : -1;
      }
    }

    if (newOffset > to) return -1;
    return newOffset;
  }
  static isInRange(paginationProps, currentOffset) {
    const {
      from = 1,
      to = Pagination.limit,
      limit = Pagination.limit,
      offset,
      isMidOffset,
    } = paginationProps || {};
    const distanceToOffset = currentOffset - offset;
    if (isMidOffset) {
      const isLowerRange =
        offset - from < limit / 2 && currentOffset - from + 1 <= limit;
      const isUpperRange =
        to - offset < limit / 2 && to - currentOffset + 1 <= limit;
      const isMidRange = Math.abs(distanceToOffset) <= limit / 2;
      return isMidRange || isLowerRange || isUpperRange;
    }
    return distanceToOffset >= 0 && distanceToOffset < limit;
  }
}
module.exports = Pagination;
