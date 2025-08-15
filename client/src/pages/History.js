import { useMemo } from "react";
import { Appear, Table, Paragraph, Loading } from "arwes";
import { usePaginatedHistory } from "../hooks/useLaunches";
import Pagination from "../components/Pagination";

const History = (props) => {
  const { launches, page, totalPages, isLoading, goToPage } =
    usePaginatedHistory(null, 1, 8);

  const tableBody = useMemo(() => {
    return launches?.map((launch) => {
      return (
        <tr key={String(launch.flightNumber)}>
          <td>
            <span style={{ color: launch.success ? "greenyellow" : "red" }}>
              █
            </span>
          </td>
          <td>{launch.flightNumber}</td>
          <td>{new Date(launch.launchDate).toDateString()}</td>
          <td>{launch.mission}</td>
          <td>{launch.rocket}</td>
          <td>{launch.customers?.join(", ")}</td>
        </tr>
      );
    });
  }, [launches]);

  return (
    <article id="history">
      <Appear animate show={props.entered}>
        <Paragraph>
          History of mission launches including SpaceX launches starting from
          the year 2006.
        </Paragraph>

        {isLoading ? (
          <Loading animate>Loading history...</Loading>
        ) : (
          <>
            <Table animate>
              <table style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ width: "2rem" }}></th>
                    <th style={{ width: "3rem" }}>No.</th>
                    <th style={{ width: "9rem" }}>Date</th>
                    <th>Mission</th>
                    <th style={{ width: "7rem" }}>Rocket</th>
                    <th>Customers</th>
                  </tr>
                </thead>
                <tbody>{tableBody}</tbody>
              </table>
            </Table>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </Appear>
    </article>
  );
};

export default History;
