import { useEffect, useState } from 'react'
import faLocale from '@fullcalendar/core/locales/fa'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import moment from 'jalali-moment'

import { ReactComponent as RightIcon } from "./right.svg"
import { ReactComponent as LeftIcon } from "./left.svg"
import "./calendar.scss"


export default function Calendar({ ...props }) {
    const [range, setRange] = useState({})
    const [curentActiveMonth, setCurentActiveMonth] = useState(new Date())
    const [isLoadComplete, setIsLoadComplete] = useState(false)
    const [hlpMonthStartDayDate, setHlpMonthStartDayDate] = useState()
    const [hlpMonthEndDayDate, setHlpMonthEndDayDate] = useState()

    const jalaiDate = moment(new Date(curentActiveMonth)).locale('fa').format('YYYY/MM/DD')
    const month = resolveMonthName(jalaiDate.split('/')[1])
    const year = jalaiDate.split('/')[0]

    useEffect(() => {
        calculateCalendarDays(curentActiveMonth)
    }, [])

    const calculateCalendarDays = (activeDate) => {
        setIsLoadComplete(false)

        const jalaiMonthStartDate = moment(new Date(activeDate)).locale('fa').format('YYYY/MM/01')
        const hlpDate = new Date(moment.from(jalaiMonthStartDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'))
        const calendarStartDate = hlpDate

        if (hlpDate.getDay() !== 6) {
            calendarStartDate.setDate(calendarStartDate.getDate() - (hlpDate.getDay() + 1))
        }

        const calendarEndDate = new Date(calendarStartDate)
        calendarEndDate.setDate(calendarEndDate.getDate() + 41)
        setRange({
            start: calendarStartDate,
            end: calendarEndDate
        })
        setIsLoadComplete(true)

        setHlpMonthStartDayDate(new Date(moment.from(jalaiMonthStartDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD')))
        const jalaiMonthEndDate = moment(new Date(activeDate)).locale('fa').add(1, 'jMonth').format('YYYY/MM/01')
        setHlpMonthEndDayDate(new Date(moment.from(jalaiMonthEndDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD')))

    }

    const showNextMonth = () => {
        const jalaiNextMonth = moment(new Date(curentActiveMonth)).add(1, 'jMonth')._d
        setCurentActiveMonth(jalaiNextMonth)
        calculateCalendarDays(jalaiNextMonth)
    }

    const showPreviousMonth = () => {
        const jalaiPreviousMonth = moment(new Date(curentActiveMonth)).subtract(1, 'jMonth')._d
        setCurentActiveMonth(jalaiPreviousMonth)
        calculateCalendarDays(jalaiPreviousMonth)
    }

    const showToday = () => {
        setCurentActiveMonth(new Date())
        calculateCalendarDays(new Date())
    }
    const calendar = document.getElementsByClassName('fc-daygrid-day')

    const dayCellDidMount = (hlpMonthStartDayDate, hlpMonthEndDayDate) => {

        for (let i = 0; i < calendar.length; i++) {
            calendar[i].className = calendar[i].className.replace(' fc-day-other', '')
            if ((new Date(calendar[i].getAttribute('data-date'))).getTime() >= new Date(hlpMonthEndDayDate).getTime() ||
                (new Date(calendar[i].getAttribute('data-date'))).getTime() < new Date(hlpMonthStartDayDate).getTime()) {
                calendar[i].className += ' fc-day-other'
            }
        }
    }

    return (
        <>
            {isLoadComplete &&
                <>
                    <div className='claendar-toolbar'>
                        <div
                            className='toolbar-arrow-right'
                            onClick={showPreviousMonth}
                        >
                            <RightIcon />
                        </div>
                        <h1>{month} {year}</h1>
                        <div className='left-toolbar'>
                            <div
                                className='toolbar-today'
                                onClick={showToday}
                            >
                                امروز
                            </div>
                            <div
                                className='toolbar-arrow-left'
                                onClick={showNextMonth}
                            >
                                <LeftIcon />
                            </div>
                        </div>
                    </div>
                    <FullCalendar
                        initialView="dayGrid"
                        plugins={[dayGridPlugin]}
                        locale={faLocale}
                        visibleRange={range}
                        dayCellDidMount={() => dayCellDidMount(hlpMonthStartDayDate, hlpMonthEndDayDate)}
                        headerToolbar={false}
                        {...props}
                    />
                </>
            }
        </>
    )
}


export function resolveMonthName(monthNumber) {
    const monthName = {
        '01': 'فروردین',
        '02': 'اردیبهشت',
        '03': 'خرداد',
        '04': 'تیر',
        '05': 'مرداد',
        '06': 'شهریور',
        '07': 'مهر',
        '08': 'آبان',
        '09': 'آذر',
        1: 'فروردین',
        2: 'اردیبهشت',
        3: 'خرداد',
        4: 'تیر',
        5: 'مرداد',
        6: 'شهریور',
        7: 'مهر',
        8: 'آبان',
        9: 'آذر',
        10: 'دی',
        11: 'بهمن',
        12: 'اسفند',
    }[monthNumber]

    return monthName
}