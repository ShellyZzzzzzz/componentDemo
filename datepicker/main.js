(function () {
    'use strict';
    var datepicker = {};

    var monthDate;
    var $wrapper;

    datepicker.render = function (direction) {

        var year, month;

        if (monthDate) {
            year = monthDate.year;
            month = monthDate.month;
        }

        if (direction === 'prev') {
            month--;
        }
        if (direction === 'next') {
            month++;
        }

        var html = this.buildUI(year, month);

        $wrapper = document.querySelector('.ui-datepicker-wrapper');
        if(!$wrapper) {
            $wrapper = document.createElement('div');
            $wrapper.className = 'ui-datepicker-wrapper';
            document.body.appendChild($wrapper);
        }
        $wrapper.innerHTML = html;
    };

    datepicker.init = function ($input) {
        datepicker.render();

        var isOpen = false;

        $input.addEventListener('click', function () {
            if(isOpen) {
                $wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen = false;
            } else {
                $wrapper.classList.add('ui-datepicker-wrapper-show');
                var left = $input.offsetLeft;
                var top = $input.offsetTop;
                var height = $input.offsetHeight;
                $wrapper.style.left = left + 'px';
                $wrapper.style.top = top + height + 2 + 'px';

                isOpen = true;
            }
        }, false);

        $wrapper.addEventListener('click', function (e) {
            var $target = e.target;
            if (!$target.classList.contains('ui-datepicker-btn')) {
                return;
            }

            if ($target.classList.contains('ui-datepicker-prev-btn')) { // 上个月
                datepicker.render('prev');
            } else if ($target.classList.contains('ui-datepicker-next-btn')) { // 下个月
                datepicker.render('next');
            }
        }, false);

        $wrapper.addEventListener('click', function (e) {
            var $target = e.target;
            if ($target.tagName.toLowerCase() !== 'td') {
                return;
            }

            var date = new Date(monthDate.year, monthDate.month - 1, $target.dataset.date);
            $input.value = format(date);
            $wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = false;
        }, false);
    };

    datepicker.buildUI = function (year, month) {
        monthDate = this.getMonthDate(year, month);
        var html = '<div class="ui-datepicker-header">'
                    +'<a class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>'
                    +'<span class="ui-datepicker-cur-month">' + monthDate.year + '-' + monthDate.month + '</span>'
                    +'<a class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'
                +'</div>'
                +'<div class="ui-datepicker-body">'
                    +'<table>'
                        +'<thead>'
                            +'<tr>'
                                +'<th>一</th>'
                                +'<th>二</th>'
                                +'<th>三</th>'
                                +'<th>四</th>'
                                +'<th>五</th>'
                                +'<th>六</th>'
                                +'<th>日</th>'
                            +'</tr>'
                        +'</thead>'
                        +'<tbody>';
        for (var i = 0; i < monthDate.days.length; i++) {
            if (i % 7 === 0) {
                html += '<tr>';
            }
            var data = monthDate.days[i];
            var isThisMonthClass = data.isThisMonth ? '' : ' class="not-this-month-day" ';
            html += '<td' + isThisMonthClass + ' data-date="' + data.date + '">' + monthDate.days[i].showDate + '</td>';
            if (i % 7 === 6) {
                html += '</td>';
            }
        }
        html += '</tbody>'
            +'</table>'
            +'</div>';
        return html;
    };

    datepicker.getMonthDate = function (year, month) {

        var ret = [];

        if (!year || !month) {
            var today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
        }

        var lastDayOfLastMonth = new Date(year, month - 1, 0);
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate();

        var firstDay = new Date(year, month - 1, 1);
        var firstDayWeekDay = firstDay.getDay();
        if (firstDayWeekDay === 0) {
            firstDayWeekDay = 7;
        }

        // 修正年份和月份 防止日期越界引起的问题
        year = firstDay.getFullYear();
        month = firstDay.getMonth() + 1;

        var preMonthDayCount = firstDayWeekDay - 1;

        var lastDay = new Date(year, month, 0);
        var lastDate = lastDay.getDate();

        for (var i = 0; i < 6 * 7; i++) {
            var date = i + 1 - preMonthDayCount;
            var showDate = date;
            var thisMonth = month;
            if (date <= 0) { // 上个月
                thisMonth = month - 1;
                showDate = lastDateOfLastMonth + date;
            } else if (date > lastDate) { // 下个月
                thisMonth = month + 1;
                showDate = date - lastDate;
            }

            if(thisMonth === 0) {
                thisMonth = 12;
            }
            if(thisMonth === 13) {
                thisMonth = 1;
            }

            ret.push({
                month: thisMonth,
                date: date,
                showDate: showDate,
                isThisMonth: date > 0 && date <=lastDate
            });
        }
        return {
            year: year,
            month: month,
            days: ret
        }
    };

    function format (date) {
        var formatStr = '';

        var padding = function (n) {
            if (n <= 9) {
                n = '0' + n;
            }
            return n;
        }
        formatStr += date.getFullYear() + '-';
        formatStr += padding(date.getMonth() + 1) + '-';
        formatStr += padding(date.getDate());
        return formatStr;
    }

    window.datepicker = datepicker;
})();