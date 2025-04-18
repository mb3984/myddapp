import React, { useEffect, useState } from "react";
import axios from "axios";
import { encryptContent, decryptContent } from "../utils/encryption";
import "./Dashboard.css"; // Import the updated CSS file

const Dashboard = () => {
  const [diary, setDiary] = useState("");
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // To track the selected exact date
  const [editingEntry, setEditingEntry] = useState(null); // To track the entry being edited

  const secret = localStorage.getItem("secret");
  const token = localStorage.getItem("token");

  // Generate full range for dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i).sort(
    (a, b) => a - b
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const fetchEntries = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/diary", {
        headers: { token },
      });
      const decrypted = res.data.map((entry) => ({
        ...entry,
        content: decryptContent(entry.content, secret),
      }));
      setEntries(decrypted);
      setFilteredEntries(decrypted); // Initially show all entries
    } catch (error) {
      console.error("Error fetching entries:", error);
      alert("Failed to load diary entries.");
    }
  };

  const saveEntry = async () => {
    const encrypted = encryptContent(diary, secret);
    try {
      await axios.post(
        "http://localhost:4000/api/diary",
        { content: encrypted },
        {
          headers: { token },
        }
      );
      setDiary("");
      fetchEntries();
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save diary entry.");
    }
  };

  const filterByDate = () => {
    const selected =
      selectedYear && selectedMonth && selectedDay
        ? new Date(`${selectedYear}-${selectedMonth}-${selectedDay}`)
        : null;

    setSelectedDate(selected);

    if (selected) {
      const filtered = entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getFullYear() === selected.getFullYear() &&
          entryDate.getMonth() === selected.getMonth() &&
          entryDate.getDate() === selected.getDate()
        );
      });
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries); // Show all entries if no date is selected
    }
  };

  const editEntry = (entry) => {
    setEditingEntry(entry); // Set the entry for editing
    setDiary(entry.content); // Populate the text area with the content for editing
  };

  const updateEntry = async () => {
    const encrypted = encryptContent(diary, secret);
    try {
      await axios.put(
        `http://localhost:4000/api/diary/${editingEntry._id}`,
        { content: encrypted },
        {
          headers: { token },
        }
      );
      setEditingEntry(null); // Clear editing state
      setDiary(""); // Clear the text area
      fetchEntries();
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update diary entry.");
    }
  };

  const deleteEntry = async (id) => {
    console.log("Attempting to delete entry with ID:", id); // Log the ID being deleted

    try {
      await axios.delete(`http://localhost:4000/api/diary/${id}`, {
        headers: { token },
      });
      console.log(`Entry with ID ${id} deleted successfully`); // Log success message
      fetchEntries(); // Reload entries after deletion
    } catch (error) {
      console.error(
        "Error deleting entry:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to delete the entry. Please try again.");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    filterByDate(); // Run filter when year/month/day changes
  }, [selectedYear, selectedMonth, selectedDay]);

  return (
    <div className="dashboard-container">
      <h2>Your Diary</h2>

      <textarea value={diary} onChange={(e) => setDiary(e.target.value)} />
      <button onClick={editingEntry ? updateEntry : saveEntry}>
        {editingEntry ? "Update" : "Save"}
      </button>

      <div className="select-container">
        <label>Filter by date: </label>
        <select
          onChange={(e) => setSelectedYear(e.target.value)}
          value={selectedYear}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedMonth(e.target.value)}
          value={selectedMonth}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedDay(e.target.value)}
          value={selectedDay}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <ul>
        {filteredEntries.length === 0 ? (
          <p>
            No entries found for selected date{" "}
            {selectedDate ? selectedDate.toLocaleDateString() : ""}.
          </p>
        ) : (
          filteredEntries.map((e) => (
            <li key={e._id}>
              {e.content} ({new Date(e.date).toLocaleString()})
              <button onClick={() => editEntry(e)}>Edit</button>
              <button onClick={() => deleteEntry(e._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
