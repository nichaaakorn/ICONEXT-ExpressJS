function getCalender(data) {
    const parse_data = JSON.parse(data);
    let eventObj = [];
    for (const key in parse_data) {
        if (parse_data.hasOwnProperty(key)) {
            var startDate = parse_data[key].Start_Date;
            var setStartDate = startDate.substring(6, 10) + "-" + startDate.substring(3, 5) + "-" + startDate.substring(0, 2);

            var setEndDate = null;
            if (parse_data[key].End_Date != null) {
                var EndDate = parse_data[key].End_Date;
                var setEndDate = EndDate.substring(6, 10) + "-" + EndDate.substring(3, 5) + "-" + EndDate.substring(0, 2);
            }

            eventObj[key] = {
                title: parse_data[key].Subject,
                start: setStartDate,
                end: setEndDate,
            }
        }
    }
    document.addEventListener('DOMContentLoaded', function () {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: '2020-11-07',
            selectable: true,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: eventObj,
            dateClick: function (info) {
                const formatDate = info.dateStr.substring(8, 10) + "/" + info.dateStr.substring(5, 7) + "/" + info.dateStr.substring(0, 4)

                $("#showModal").empty();
                const createModal =
                    /*html*/
                    `<div class="modal fade" id="myModal" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form action="/addHoliday" method="POST" class="needs-validation" novalidate>
                                    <div class="modal-header">
                                        <h4 class="modal-title">Start Date ${formatDate}</h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="form-group">
                                            <label for="Subject">Subject</label>
                                            <input autocomplete="off" type="text" class="form-control" name="Subject" id="Subject"
                                                aria-describedby="helpId" placeholder="Subject" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="EndDate">End Date</label>
                                            <input type="date" class="form-control" name="EndDate" id="EndDate" 
                                            value="${info.dateStr}" required>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <input type="hidden" name="StartDate" value="${info.dateStr}">
                                        <button type="submit" class="btn btn-primary">Confirm</button>
                                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>`
                $("#showModal").append(createModal);
                $("#myModal").modal();
            },
            eventClick: function (info) {
                $("#showModal").empty();
                const createModal =
                    /*html*/
                    `<div class="modal fade" id="myModal" role="dialog">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <form action="/deleteHoliday" method="POST" class="needs-validation" novalidate>
                                    <div class="d-flex justify-content-between m-3">
                                        <div>
                                            <h4 class="modal-title">${info.event.title}</h4>
                                        </div>
                                        <div>
                                            <input type="hidden" name="Subject" value="${info.event.title}">
                                            <button type="submit" class="btn btn-danger">Delete</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>`
                $("#showModal").append(createModal);
                $("#myModal").modal();
            }
        });
        calendar.render();
    });
}