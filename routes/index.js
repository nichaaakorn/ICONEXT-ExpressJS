const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const db = require("../database/database");

router.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/project', async function(req, res, next) {
    const result = await db.getProject();
    res.render('index', { Projects: result.recordset });
});

router.post('/getOneTID', async function(req, res, next) {
    const PID = req.body.PID;
    const getOneTID = await db.getOneTasksProject(PID);
    let TID;
    if (getOneTID.length == 0) {
        TID = 0;
    } else {
        TID = getOneTID[0].TID
    }
    res.redirect(`/project/viewproject/${PID}/${TID}`);
});

router.post('/createproject', async function(req, res, next) {
    const projectName = req.body.projectName;
    const partnerProject = req.body.partnerProject;
    const custtomerProject = req.body.customerProject;
    const dateProject = req.body.dateProject;

    const addProject = [projectName, partnerProject, custtomerProject, dateProject];

    await db.addProject(addProject);

    res.redirect('/project');
});

router.get('/project/editproject/:PID', async function(req, res, next) {
    const PID = req.params.PID;
    const result = await db.getProjectByID(PID);
    res.render('EditProject', { Projects: result.recordset[0] });
});

router.get('/project/viewproject/:PID/:TID', async function(req, res, next) {
    const PID = req.params.PID;
    const TID = req.params.TID;
    const getprojectByID = await db.getProjectByID(PID);
    const getTasksProject = await db.getTasksProject(PID);
    const getTasksByTID = await db.getTasksByTID(TID);
    const getPhase = await db.getPhaseTasks(TID);
    const getStaff = await db.getStaff();
    const getOutsouce = await db.getOutsouce();
    const getPosition = await db.getPosition();

    var output;
    if (getTasksByTID.recordset.length == 0) {
        output = {
            TID: 0,
            Tasks: "",
            PID: PID,
        };
    } else {
        output = {
            TID: getTasksByTID.recordset[0].TID,
            Tasks: getTasksByTID.recordset[0].Tasks,
            PID: getTasksByTID.recordset[0].PID,
        };
    }
    res.render('ViewProject', {
        Projects: getprojectByID.recordset[0],
        Tasks: getTasksProject.recordset,
        Phases: getPhase.recordset,
        Outsource: getOutsouce.recordset,
        Staffs: getStaff.recordset,
        oneTask: output,
        Positions: getPosition.recordset
    });
});

router.get('/edittasks/:TID', async function(req, res, next) {
    const TID = req.params.TID;
    const result = await db.getTasksByTID(TID);
    res.render('EditTask', { Tasks: result.recordset[0] })
});

router.post('/updateTasks', async function(req, res, next) {
    const TID = req.body.TID;
    const PID = req.body.PID;
    const TaskName = req.body.TaskName;
    const updateTask = [TID, TaskName];
    await db.updateTask(updateTask);
    res.redirect(`/project/viewproject/${PID}/${TID}`);
});

router.post('/createtasks', async function(req, res, next) {
    const PID = req.body.PID;
    const TaskName = req.body.tasksName;
    const addTask = [TaskName, PID];
    await db.addTasks(addTask);
    const urlTID = await db.getTasksByName(TaskName);
    res.redirect(`/project/viewproject/${PID}/${urlTID.recordset[0].TID}`);
});

router.post('/deletetasks', async function(req, res, next) {
    const PID = req.body.PID;
    const TID = req.body.deleteTID;
    var urlTID = await db.getOneTasksProject(PID);
    if (urlTID == TID) {
        urlTID == 0;
    }
    await db.deleteTask(TID);
    await db.deletePhaseByTID(TID);
    res.redirect(`/project/viewproject/${PID}/${urlTID[0].TID}`);
});

router.get('/editphase/:PID/:ID', async function(req, res, next) {
    const ID = req.params.ID;
    const PID = req.params.PID;
    const getStaff = await db.getStaff();
    const getOutsouce = await db.getOutsouce();
    const getPosition = await db.getPosition();
    const result = await db.getPhaseByID(ID);

    res.render('EditPhase', {
        Project: PID,
        Phase: result.recordset[0],
        Outsource: getOutsouce.recordset,
        Staffs: getStaff.recordset,
        Positions: getPosition.recordset
    })
});

router.post('/updatephase', async function(req, res, next) {
    const PID = req.body.PID;
    const TID = req.body.TID;
    const Phase = req.body.Phase;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Manpower = req.body.Manpower;
    const Role = req.body.Position;
    const Usage = req.body.Usage;
    const ID = req.body.ID;

    const updatePhase = [ID, Phase, StartDate, EndDate, Manpower, Role, Usage]
    await db.updatePhase(updatePhase);
    res.redirect(`/project/viewproject/${PID}/${TID}`);
});

router.post('/createphase', async function(req, res, next) {
    const PID = req.body.PID;
    const Phase = req.body.Phase;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Manpower = req.body.Manpower;
    const Role = req.body.Position;
    const Usage = req.body.Usage;
    const TID = req.body.TID;

    const addPhase = [Phase, StartDate, EndDate, Manpower, Role, Usage, TID]

    await db.addPhase(addPhase);

    res.redirect(`/project/viewproject/${PID}/${TID}`);
});

router.post('/deletephase', async function(req, res, next) {
    const PID = req.body.PID;
    const TID = req.body.TID;
    const phaseID = req.body.phaseID;
    await db.deletePhase(phaseID);
    res.redirect(`/project/viewproject/${PID}/${TID}`);
});


router.post('/editproject', async function(req, res, next) {
    const PID = req.body.PID;
    const projectName = req.body.editProjectName;
    const partnerProject = req.body.editParterProject;
    const custtomerProject = req.body.editCustomerProject;
    const dateProject = req.body.editDateProject;
    const updateProject = [PID, projectName, partnerProject, custtomerProject, dateProject];
    await db.updateProject(updateProject);
    res.redirect('/project');
});

router.post('/deleteproject', async function(req, res, next) {
    const PID = req.body.PID;
    await db.deleteProject(PID);
    await db.deleteTask(PID);
    res.redirect('/project');
});

router.get('/manpower/staff', async function(req, res, next) {
    const staff = await db.getStaff();
    const postion = await db.getPosition();
    res.render('Staff', { Staffs: staff.recordset, Positions: postion.recordset });
});

router.get('/manpower/outsource', async function(req, res, next) {
    const staff = await db.getOutsouce();
    const postion = await db.getPosition();
    res.render('Outsource', { Staffs: staff.recordset, Positions: postion.recordset });
});

router.post('/addstaff', async function(req, res, next) {
    const ID = req.body.ID;
    const Title = req.body.Title;
    const Name = req.body.Name;
    const Surname = req.body.Surname;
    const Nickname = req.body.Nickname;
    const Position = req.body.Position;
    const Tel = req.body.Tel;
    const Email = req.body.Email;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Active = req.body.Active;
    const addStaff = [ID, Title, Name, Surname, Nickname, Position, Tel, Email, StartDate, EndDate, Active]
    await db.addStaff(addStaff);
    res.redirect('/manpower/staff')
});

router.post('/addoutsource', async function(req, res, next) {
    const ID = req.body.ID;
    const Title = req.body.Title;
    const Name = req.body.Name;
    const Surname = req.body.Surname;
    const Nickname = req.body.Nickname;
    const Position = req.body.Position;
    const Tel = req.body.Tel;
    const Email = req.body.Email;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Active = req.body.Active;
    const addStaff = [ID, Title, Name, Surname, Nickname, Position, Tel, Email, StartDate, EndDate, Active]
    await db.addOutsource(addStaff);
    res.redirect('/manpower/outsource')
});

router.get('/editstaff/:ID', async function(req, res, next) {
    const ID = req.params.ID
    const result = await db.getStaffByID(ID);
    const postion = await db.getPosition();
    res.render('EditStaff', { Staffs: result.recordset[0], Positions: postion.recordset });
});

router.get('/editoutsource/:ID', async function(req, res, next) {
    const ID = req.params.ID
    const result = await db.getOutsouceByID(ID);
    const postion = await db.getPosition();
    res.render('EditOutsource', { Staffs: result.recordset[0], Positions: postion.recordset });
});

router.post('/updatestaff', async function(req, res, next) {
    const editID = req.body.editID;
    const ID = req.body.ID;
    const Title = req.body.Title;
    const Name = req.body.Name;
    const Surname = req.body.Surname;
    const Nickname = req.body.Nickname;
    const Position = req.body.Position;
    const Tel = req.body.Tel;
    const Email = req.body.Email;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Active = req.body.Active;
    const updateStaff = [editID, ID, Title, Name, Surname, Nickname, Position, Tel, Email, StartDate, EndDate, Active]
    await db.updateStaff(updateStaff);
    res.redirect('/manpower/staff');
});

router.post('/updateoutsource', async function(req, res, next) {
    const editID = req.body.editID;
    const ID = req.body.ID;
    const Title = req.body.Title;
    const Name = req.body.Name;
    const Surname = req.body.Surname;
    const Nickname = req.body.Nickname;
    const Position = req.body.Position;
    const Tel = req.body.Tel;
    const Email = req.body.Email;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Active = req.body.Active;
    const updateStaff = [editID, ID, Title, Name, Surname, Nickname, Position, Tel, Email, StartDate, EndDate, Active]
    await db.updateOutsource(updateStaff);
    res.redirect('/manpower/outsource');
});

router.post('/deletestaff', async function(req, res, next) {
    const EID = req.body.EID;
    await db.deleteStaff(EID);
    res.redirect('/manpower/staff');
});

router.post('/deleteoutsource', async function(req, res, next) {
    const ID = req.body.ID;
    await db.deleteOutsource(ID);
    res.redirect('/manpower/outsource');
});

router.get('/position', async function(req, res, next) {
    const result = await db.getPosition();
    res.render('Position', { Positions: result.recordset });
});

router.get('/editposition/:PosID', async function(req, res, next) {
    const PosID = req.params.PosID;
    const result = await db.getPositionByID(PosID);
    res.render('EditPosition', { Positions: result.recordset[0] });
});

router.post('/updatePosition', async function(req, res, next) {
    const PosID = req.body.PosID;
    const Position = req.body.Position;
    const Description = req.body.Description;
    const Cost = req.body.Cost;
    const updatePosition = [PosID, Position, Description, Cost];
    await db.updatePositions(updatePosition);
    res.redirect('/position');
});

router.post('/addposition', async function(req, res, next) {
    const Position = req.body.Position;
    const Description = req.body.Description;
    const Cost = req.body.Cost;
    const addPosition = [Position, Description, Cost];
    await db.addPosition(addPosition);
    res.redirect('/position');
});

router.post('/deleteposition', async function(req, res, next) {
    const PosID = req.body.PosID;
    await db.deletePosition(PosID);
    res.redirect('/position');
});

router.get('/leave/staff', async function(req, res, next) {
    const staff = await db.getStaff();
    res.render('LeaveStaff', { Staffs: staff.recordset });
});

router.get('/leave/outsource', async function(req, res, next) {
    const staff = await db.getOutsouce();
    res.render('LeaveOutsource', { Staffs: staff.recordset });
});

router.get('/viewleave/:ID', async function(req, res, next) {
    const ID = req.params.ID
    const getLeaveByID = await db.getLeaveByID(ID);
    var staff;
    var output;
    if (ID.substring(0, 1) == "O") {
        staff = await db.getOutsouceByID(ID);
        output = {
            ID: staff.recordset[0].ID,
            Name: staff.recordset[0].Name,
            SurName: staff.recordset[0].SurName,
        }
    } else {
        staff = await db.getStaffByID(ID);
        output = {
            ID: staff.recordset[0].EID,
            Name: staff.recordset[0].Name,
            SurName: staff.recordset[0].SurName,
        }
    }
    res.render('Leave', { Staffs: output, Leaves: getLeaveByID.recordset })
});

router.post('/addLeave', async function(req, res, next) {
    const ID = req.body.ID;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Annotation = req.body.Annotation;
    const Days = await db.calculateDate({ StartDate: StartDate, EndDate: EndDate });
    const addLeave = [StartDate, EndDate, Annotation, Days.recordset[0].Day, ID]
    await db.addLeave(addLeave);
    res.redirect(`/viewleave/${ID}`);
});

router.post('/deleteleave', async function(req, res, next) {
    const LID = req.body.LID;
    const ID = req.body.ID;
    await db.deleteLeaveByLID(LID);
    res.redirect(`/viewleave/${ID}`);
});

router.get('/Holiday', async function(req, res, next) {
    const result = await db.getHoliday();
    res.render('Holiday', { Holidays: result.recordset });
});

router.post('/addHoliday', async function(req, res, next) {
    const Subject = req.body.Subject
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const setStartDate = StartDate.substring(8, 10) + "/" + StartDate.substring(5, 7) + "/" + StartDate.substring(0, 4)
    const setEndDate = EndDate.substring(8, 10) + "/" + EndDate.substring(5, 7) + "/" + EndDate.substring(0, 4)

    const addHoliday = [Subject, setStartDate, setEndDate];

    await db.addHoliday(addHoliday);

    res.redirect('/Holiday');
});

router.post('/deleteHoliday', async function(req, res, next) {
    const Subject = req.body.Subject;
    await db.deleteHoliday(Subject);
    res.redirect('/Holiday');
});


router.get('/projectposition/:PID', async function(req, res, next) {
    const PID = req.params.PID;
    const Project = await db.getProjectByID(PID);
    const Manpowers = await db.getManpowerInProject(PID);

    var indexArray = 0;
    let ObjectManpowerUsage = [];
    let Usage, date;


    for (const key in Manpowers.recordset) {
        const element = Manpowers.recordset[key];

        const result = await db.getUsageByManpower(element.Manpower, PID);

        const getIdEmployee = await db.checkIdEmployee(element.Manpower);
        const getIdOutsource = await db.checkIdOutsouce(element.Manpower);

        let calculateUsage = 0;

        for (const i in result.recordset) {


            Usage = result.recordset[i];



            const StartDate = Usage.StartDate.substring(8, 10) + "/" + Usage.StartDate.substring(5, 7) + "/" + Usage.StartDate.substring(0, 4);
            const EndDate = Usage.EndDate.substring(8, 10) + "/" + Usage.EndDate.substring(5, 7) + "/" + Usage.EndDate.substring(0, 4);
            const Month = Usage.StartDate.substring(5, 7);



            if (getIdEmployee.recordset[0] != null) {

                var getLeaveDay = await db.getLeaveBetweenDate(Usage.StartDate, Usage.EndDate, getIdEmployee.recordset[0].EID)
            } else {

                var getLeaveDay = await db.getLeaveBetweenDate(Usage.StartDate, Usage.EndDate, getIdOutsource.recordset[0].ID)
            }

            var leaveDay = 0;
            if (getLeaveDay.recordset[0] != null) {
                leaveDay = getLeaveDay.recordset[0].Days
            } else {
                leaveDay = 0;
            }


            const DayHoliday = await db.getHolidayBetweenDate(StartDate, EndDate, Month)
                //console.log(DayHoliday.recordset);


            date = await db.calculateDate(Usage);


            // Holiday, Leave
            if (DayHoliday.recordset[0] != null) {
                calculateUsage =
                    calculateUsage + (parseInt(Usage.Usage) * ((date.recordset[0].Day - leaveDay) - DayHoliday.recordset.length));
                indexArray++;

                // not holiday,leave
            } else {
                calculateUsage =
                    calculateUsage + (parseInt(Usage.Usage) * date.recordset[0].Day - leaveDay);
                indexArray++;
            }

        }

        const Cost = parseInt(((calculateUsage / 100) * element.Cost) / 20)

        // จากนั้นสุดท้ายจะเก็บพนักงานเป็น Object ไว้
        ObjectManpowerUsage[key] = {
            Name: element.Manpower,
            Position: element.Position,
            CostMonth: element.Cost,
            Usage: parseFloat(calculateUsage / 100),
            Cost: Cost,
        }
    }

    // total
    let TotalCost = 0;
    for (const key in ObjectManpowerUsage) {
        if (ObjectManpowerUsage.hasOwnProperty(key)) {
            const element = ObjectManpowerUsage[key];
            TotalCost = TotalCost + element.Cost;
        }
    }
    res.render('ProjectPosition', { Manpowers: ObjectManpowerUsage, Total: TotalCost, Project: Project.recordset[0] });
});

router.post('/report/:PID', async function(req, res, next) {
    const PID = req.params.PID;
    const Month = await db.getMonthInProject(PID);
    res.redirect(`/report/${PID}/${Month.recordset[0].Month}`);
});


router.get('/report/:PID/:Month', async function(req, res, next) {
    const PID = req.params.PID;
    const month = req.params.Month;
    const arrayMonth = ["", "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];


    if (month.length == 1) {
        var monthModify = "0" + month;
    } else {
        var monthModify = month;
    }


    const getProject = await db.getProjectByID(PID);


    const getManpower = await db.getManpowerOfProject(PID, monthModify);


    const getHolidayInMonth = await db.getHolidayInMonth(month);


    const getMonthInProject = await db.getMonthInProject(PID);

    var manpowerObject = [];
    let nameManpower = "";


    for (const key in getManpower.recordset) {


        const getIdEmployee = await db.checkIdEmployee(getManpower.recordset[key].Manpower);
        const getIdOutsource = await db.checkIdOutsouce(getManpower.recordset[key].Manpower);


        if (getIdEmployee.recordset[0] != null) {
            nameManpower = getManpower.recordset[key].Manpower;
            // Leave
            var getLeaveDay = await db.getLeaveInMonth(getIdEmployee.recordset[0].EID, monthModify)
        } else {

            nameManpower = getManpower.recordset[key].Manpower;

            var getLeaveDay = await db.getLeaveInMonth(getIdOutsource.recordset[0].ID, monthModify)
        }

        manpowerObject[key] = {
            Name: nameManpower,
            Leave: getLeaveDay.recordset,
        }
    }
    res.render('ReportProject', {
        ObjectManpower: manpowerObject,
        Holiday: getHolidayInMonth.recordset,
        Project: getProject.recordset[0],
        Months: getMonthInProject.recordset,
        monthName: arrayMonth[month],
        monthTarget: month,
    });
});

module.exports = router;