import { withStyles } from "arwes";
import Clickable from "./Clickable";

const styles = () => ({
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
    padding: "10px",
  },
  pageButton: {
    padding: "5px 10px",
    border: "1px solid #26daaa",
    background: "transparent",
    color: "#26daaa",
    cursor: "pointer",
    minWidth: "45px",
    textAlign: "center",
    "&:hover": {
      background: "rgba(38, 218, 170, 0.1)",
    },
  },
  activePageButton: {
    background: "#26daaa",
    color: "#000",
    "&:hover": {
      background: "#26daaa",
    },
  },
  disabledPageButton: {
    opacity: 0.5,
    cursor: "not-allowed",
    "&:hover": {
      background: "transparent",
    },
  },
  pageInfo: {
    color: "#26daaa",
    fontSize: "14px",
    margin: "0 10px",
  },
});

const Pagination = ({ currentPage, totalPages, onPageChange, classes }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={classes.pagination}>
      <Clickable
        className={[
          classes.pageButton,
          currentPage === 1 ? classes.disabledPageButton : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handlePrevious}
      >
        ←
      </Clickable>

      {pageNumbers[0] > 1 && (
        <>
          <Clickable
            className={classes.pageButton}
            onClick={() => handlePageClick(1)}
          >
            1
          </Clickable>
          {pageNumbers[0] > 2 && <span className={classes.pageInfo}>...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Clickable
          key={page}
          className={[
            classes.pageButton,
            page === currentPage ? classes.activePageButton : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </Clickable>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className={classes.pageInfo}>...</span>
          )}
          <Clickable
            className={classes.pageButton}
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </Clickable>
        </>
      )}

      <Clickable
        className={[
          classes.pageButton,
          currentPage === totalPages ? classes.disabledPageButton : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleNext}
      >
        →
      </Clickable>

      <div className={classes.pageInfo}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default withStyles(styles)(Pagination);
