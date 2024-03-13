import React, { useEffect, useState } from "react";
import "../styles/calendar.css";
import axios from "axios";
import {
  Inject,
  ScheduleComponent,
  ButtonComponent,
  Day,
  Week,
  Month,
  Agenda,
  ViewsDirective,
  ViewDirective,
  TimelineViews,
  TimelineMonth,
  DragAndDrop,
  Resize,
} from "@syncfusion/ej2-react-schedule";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";

import { L10n } from "@syncfusion/ej2-base";
import ColorCode from "./helpers/ColorCode";

L10n.load({
  "en-US": {
    schedule: {
      saveButton: "Add",
      cancelButton: "Close",
      deleteButton: "Remove",
      newEvent: "Add Event",
    },
  },
});

const getColor = (status) => {
  switch (status) {
    case "New":
      return "#FFD700";
    case "Blocked":
      return "#FF6347";
    case "Confirmed":
      return "#32CD32";
    case "Unable":
      return "#87CEFA";
    default:
      return "#FFD700";
  }
};

const getTime = (value) => {
  const date = new Date(value);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedTime = `${formattedHours}:${formattedMinutes}`;
  if (formattedTime === "NaN:NaN") {
    return "";
  } else {
    return formattedTime;
  }
};

const getTimeString = (start, end) => {
  const startTime = getTime(start);
  const endTime = getTime(end);
  if (startTime === "" && endTime === "") {
    return "";
  } else {
    return `Time : ${startTime} - ${endTime}`;
  }
};

const eventTemplate = (e) => {
  const secondaryColor = { background: e.Color };
  const primaryColor_1 = { background: e.Color };
  const primaryColor_2 = { background: e.Color };
  return (
    <div className="template-wrap" style={secondaryColor}>
      <div className="subject" style={primaryColor_1}>
        {e.Subject}
      </div>
      <div className="time" style={primaryColor_2}>
        {getTimeString(e.StartTime, e.EndTime)}
      </div>
      <div className="reg" style={primaryColor_2}>
        {
          <div className="time" style={primaryColor_2}>
            {e.StdReg ? `Student: ${e.StdReg}` : ""}
          </div>
        }
      </div>
    </div>
  );
};

const StaffCalendar = () => {
  const [selectedStaffEmail, setSelectedStaffEmail] = useState(
    JSON.parse(sessionStorage.getItem("selectedStaffEmail"))
  );

  const [blocked, setBlocked] = useState();

  const [appointments, setAppointments] = useState({
    dataSource: [],
    fields: {
      subject: { default: "No title is provided" },
    },
  });

  const [selectedAptId, setSelectedAptId] = useState(0);
  const [isDragged, setIsDragged] = useState(false);
  const [isResized, setIsResized] = useState(false);

  const [staffDetails, setStaffDetails] = useState({});

  const getAllAppointments = async (Lecturer_mail) => {
    try {
      const url = `http://localhost:8080/db/appointments/${Lecturer_mail}`;
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("isDragged", JSON.stringify(false));
    const getStaffDetails = async () => {
      try {
        const url = `http://localhost:8080/db//staff/${selectedStaffEmail}`;
        const response = await axios.get(url);
        setStaffDetails(response.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    getStaffDetails();
    const fetchData = async () => {
      try {
        const data = await getAllAppointments(selectedStaffEmail);
        setAppointments({
          dataSource: data.map((item) => ({
            Id: item.Id,
            Subject: item.Subject || "No title is provided",
            EventType: item.Apt_status,
            StartTime: new Date(item.StartTime),
            EndTime: new Date(item.EndTime),
            Description: item.Description,
            Color: getColor(item.Apt_status),
            StdReg: item.Student_reg,
            lecMail: item.Lecturer_mail,
          })),
          fields: {
            subject: { default: "No title is provided" },
          },
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("isDragged", JSON.stringify(false));
    const getStaffDetails = async () => {
      try {
        const url = `http://localhost:8080/db//staff/${selectedStaffEmail}`;
        const response = await axios.get(url);
        setStaffDetails(response.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    getStaffDetails();
    const fetchData = async () => {
      try {
        const data = await getAllAppointments(selectedStaffEmail);
        setAppointments({
          dataSource: data.map((item) => ({
            Id: item.Id,
            Subject: item.Subject || "No title is provided",
            EventType: item.Apt_status,
            StartTime: new Date(item.StartTime),
            EndTime: new Date(item.EndTime),
            Description: item.Description,
            StdReg: item.Student_reg,
            lecMail: item.Lecturer_mail,
            Color: getColor(item.Apt_status),
          })),
          fields: {
            subject: { default: "No title is provided" },
          },
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    setBlocked(false);
  }, [blocked]);

  const onDragStart = (e) => {
    e.interval = 10;
    setSelectedAptId(e.data.Id);
  };

  const onDragStop = (e) => {
    sessionStorage.setItem("isDragged", JSON.stringify(true));
    updateAppointment(
      e.data.Subject,
      e.data.Description,
      e.data.StartTime,
      e.data.EndTime,
      e.data.EventType,
      e.data.StdReg
    );
  };

  const onResizeStart = (e) => {
    e.interval = 10;
    setSelectedAptId(e.data.Id);
  };

  const onResizeStop = (e) => {
    setIsResized(true);
    updateAppointment(
      e.data.Subject,
      e.data.Description,
      e.data.StartTime,
      e.data.EndTime,
      e.data.EventType,
      selectedAptId
    );
  };

  const ediitorWindowTemplate = (e) => {
    return (
      <table className="custom-event-editor" style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td className="e-textlabel">Summary</td>
            <td>
              <input
                id="Summary"
                className="e-field e-input"
                type="text"
                name="Subject"
                style={{ width: "100%" }}
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Status</td>
            <td>
              <DropDownListComponent
                id="EventType"
                placeholder="Choose status"
                data-name="EventType"
                className="e-field"
                // dataSource={["New", "Blocked", "Unable", "Confirmed"]}
                dataSource={
                  e.EventType === "Blocked"
                    ? ["Blocked"]
                    : e.EventType === "New" || e.EventType === "Unable"
                    ? ["Unable", "Confirmed"]
                    : ["Blocked"]
                }
                value="Blocked"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">From</td>
            <td>
              <DateTimePickerComponent
                id="StartTime"
                data-name="StartTime"
                value={new Date(e.StartTime || e.startTime)}
                format={"dd/MM/yy hh:mm a"}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">To</td>
            <td>
              <DateTimePickerComponent
                id="EndTime"
                data-name="EndTime"
                value={new Date(e.EndTime || e.endTime)}
                format={"dd/MM/yy hh:mm a"}
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Reason</td>
            <td>
              <textarea
                id="Description"
                className="e-field e-input"
                name="Description"
                rows={3}
                cols={50}
                style={{ width: "100%", height: "60px" }}
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const addAppointment = async (
    Id,
    Lecturer_mail,
    Student_reg,
    Subject,
    Description,
    StartTime,
    EndTime,
    Apt_status
  ) => {
    try {
      const url = `http://localhost:8080/db/appointment/add`;
      const response = await axios.post(url, {
        Id,
        Lecturer_mail,
        Student_reg,
        Subject,
        Description,
        StartTime,
        EndTime,
        Apt_status,
      });
      console.log(response.data);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(err.message);
      }
    }
  };

  const getLastAppointment = async () => {
    try {
      const url = `http://localhost:8080/db/appointment/last`;
      const response = await axios.get(url);
      console.log(response.data);
      if (response.data.length === 0) {
        return 1;
      } else {
        return response.data[0].Id;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateAppointment = async (
    Subject,
    Description,
    StartTime,
    EndTime,
    Apt_status,
    StdReg
  ) => {
    try {
      const url = `http://localhost:8080/db/appointment`;
      const response = await axios.put(url, {
        Id: selectedAptId,
        Subject,
        Description,
        StartTime,
        EndTime,
        Apt_status,
      });
      if (StdReg !== null) {
        sendAppointmentChangeMail(
          StartTime,
          EndTime,
          staffDetails.Email,
          StdReg
        );
      }
      sessionStorage.setItem("isDragged", JSON.stringify(false));
      setIsResized(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getStudentDetails = async (Reg_number) => {
    try {
      const url = `http://localhost:8080/db/student/details/${Reg_number}`;
      const { data } = await axios.get(url);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const getDate = (value) => {
    const date = new Date(value);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

  const sendAppointmentChangeMail = async (from, to, lecMail, StdReg) => {
    if (JSON.parse(sessionStorage.getItem("isDragged")) === true) {
      try {
        const student = await getStudentDetails(StdReg);
        const stdMail = student[0].Email;
        const url = `http://localhost:8080/mail/student/update/appointment`;
        const subject = "Change of appointment time";
        const content = `
        <p>Dear student,</p>
        <p>Your appointment with ${lecMail} has been changed.</p>
        <h2>New Appointment Details:</h2>
        <p>Date: ${getDate(from)}</p>
        <p>Time: ${getTime(from)} - ${getTime(to)}</p>
        <br>
        <p>${staffDetails.First_name} ${staffDetails.Last_name}</p>
        <p>${staffDetails.Email}</p>
        <p>${staffDetails.Department}</p>
      `;
        const { data } = await axios.post(url, { stdMail, subject, content });
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onPopupClose = async (e) => {
    console.log(e.type);
    console.log(e.data);
    if (e.data != null) {
      if (e.type === "DeleteAlert") {
        deleteAppointment(selectedAptId);
      } else if (
        // e.data.Subject !== "No title is provided" &&
        selectedAptId === undefined &&
        e.type === "Editor"
      ) {
        const lastId = await getLastAppointment();
        console.log(lastId);
        addAppointment(
          lastId + 1,
          selectedStaffEmail,
          JSON.parse(sessionStorage.getItem("regNumber"))
            ? JSON.parse(sessionStorage.getItem("regNumber"))
            : null,
          e.data.Subject === "No title is provided"
            ? "Blocked"
            : e.data.Subject,
          e.data.Description,
          e.data.StartTime,
          e.data.EndTime,
          e.data.EventType
        );
        setBlocked(true);
        window.location.reload();
      } else if (
        e.data !== null &&
        selectedAptId !== undefined &&
        e.type === "Editor"
      ) {
        console.log(e.data.StdReg);
        updateAppointment(
          e.data.Subject,
          e.data.Description,
          e.data.StartTime,
          e.data.EndTime,
          e.data.EventType,
          e.data.StdReg
        );
        window.location.reload();
      }
    } else {
      console.log(true);
    }
  };

  const onPopupOpen = (e) => {
    setSelectedAptId(e.data.Id);
  };

  const deleteAppointment = async (Id) => {
    try {
      const url = `http://localhost:8080/db/appointment/${Id}`;
      const response = await axios.delete(url);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div>
        <ColorCode />
      </div>
      <div className="calendar">
        <ScheduleComponent
          currentView="Day"
          eventSettings={{
            dataSource: appointments.dataSource,
            fields: appointments.fields,
            template: eventTemplate,
            ignoreWhitespace: true,
          }}
          dragStart={onDragStart}
          dragStop={onDragStop}
          resizeStart={onResizeStart}
          resizeStop={onResizeStop}
          editorTemplate={ediitorWindowTemplate}
          popupClose={onPopupClose}
          popupOpen={onPopupOpen}
          cssClass="schedule-cell-dimension"
          rowAutoHeight={true}
        >
          <ViewsDirective>
            <ViewDirective
              option="Day"
              startHour="08:00"
              endHour="16:00"
              interval={3}
              displayName="3 Days"
            />
            <ViewDirective option="Week" startHour="08:00" endHour="16:00" />
            <ViewDirective
              option="Month"
              // isSelected={true}
              showWeekNumber={false}
              showWeekend={false}
            />
            <ViewDirective option="Agenda" />
          </ViewsDirective>
          <Inject
            services={[
              Day,
              Week,
              Month,
              Agenda,
              TimelineMonth,
              TimelineViews,
              DragAndDrop,
              Resize,
            ]}
          />
        </ScheduleComponent>
      </div>
    </main>
  );
};

export default StaffCalendar;
