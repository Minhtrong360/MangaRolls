import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function BirthdayForm({ open, onClose, onChoose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleChoose = () => {
    onChoose(selectedDate);
    setSelectedDate(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select a Birthday</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {years.map((year) =>
                months.map((month, index) => (
                  <TableRow key={`${year}-${index}`}>
                    <TableCell>{`${month.substring(0, 3)} ${year}`}</TableCell>
                    <TableCell>
                      {days.map((day) => (
                        <Button
                          key={day}
                          variant={
                            selectedDate === `${day}/${index + 1}/${year}`
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() =>
                            setSelectedDate(`${day}/${index + 1}/${year}`)
                          }
                        >
                          {day}
                        </Button>
                      ))}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!selectedDate} onClick={handleChoose}>
          Choose
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BirthdayForm;
