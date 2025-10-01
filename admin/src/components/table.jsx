const Table = ({fields}) => {
  return (
    <table>
      <thead>
        <tr>
            {fields.map((field, index) => (
                <th key={index}>{field}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {/* Table rows will be populated here */}
      </tbody>
    </table>
  );
};

export default Table;
