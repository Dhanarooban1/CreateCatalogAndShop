const ExtractGoogleSheetData = async (SHEET_ID) => {
    try {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`);
        console.log(response)
        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(","));
        return rows;
    } catch (error) {
        console.error("Error fetching Google Sheet data:", error);
    }
};

export default ExtractGoogleSheetData;
