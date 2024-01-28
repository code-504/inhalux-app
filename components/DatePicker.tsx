import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import { MontserratSemiText } from './StyledText';
import BlurredBackground from './BlurredBackground';
import Colors from '@/constants/Colors';
import { Button } from 'tamagui';

import BottomIcon from "@/assets/icons/chevron_bottom.svg"

interface DatePickerProps extends PickerProps {
    onDateChange?: (dateRange: { start: string | null, end: string | null }) => void;
}

interface PickerProps {
    startRange?: Date;
    endRange?: Date;
}

const DatePicker = ({ startRange, endRange, onDateChange }: DatePickerProps) => {
    const dateModalRef = useRef<BottomSheetModal>(null);
    const dateSnapPoints = useMemo(() => ['55%'], []);

    const openBottomSheet = useCallback(() => {
        dateModalRef.current?.present();
    }, []);

    return (
        <View>
            <Button size="$6" backgroundColor={Colors.lightGrey} borderRadius={100} fontSize={14} onPress={openBottomSheet}>
                Fecha<BottomIcon />
            </Button>
            <BottomSheetModal
                ref={dateModalRef}
                snapPoints={dateSnapPoints}
                backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
                    <BlurredBackground {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior={'close'} />
                )}
            >
                <View style={styles.content}>
                    <MontserratSemiText style={styles.title}>Elija una fecha un rango de fechas</MontserratSemiText>
                    <Picker startRange={startRange} endRange={endRange} onDateChange={onDateChange} />
                </View>
            </BottomSheetModal>
        </View>
    );
};

const Picker = ({ startRange, endRange, onDateChange }: DatePickerProps) => {

    const [dateRange, setDateRange] = useState<{ start: string | null, end: string | null }>(() => ({
        start: startRange ? startRange.toISOString().split("T")[0] : new Date(Date.now()).toISOString().split("T")[0],
        end: endRange ? endRange.toISOString().split("T")[0] : null
    }));

    const handleDayPress = useCallback(
        (day) => {
            let newDateRange: { start: string | null, end: string | null };

            if (!dateRange.start || (dateRange.end && day.dateString < dateRange.start)) {
                newDateRange = { start: day.dateString, end: null };
            } else if (!dateRange.end && day.dateString >= dateRange.start) {
                if (day.dateString === dateRange.start) {
                    newDateRange = { start: day.dateString, end: null };
                } else {
                    const startDate = new Date(dateRange.start);
                    const endDate = new Date(day.dateString);
                    const dateDifference = Math.abs((endDate - startDate) / (24 * 60 * 60 * 1000));

                    if (dateDifference <= 60) {
                        newDateRange = { start: dateRange.start, end: day.dateString };
                    } else {
                        console.warn('Date range exceeds 60 days limit');
                        return;
                    }
                }
            } else {
                newDateRange = { start: day.dateString, end: null };
            }

            setDateRange(newDateRange);
            onDateChange && onDateChange(newDateRange);
        },
        [dateRange]
    );

    const marked = useMemo(() => {
        const markedDates = {};

        if (dateRange.start)
            markedDates[dateRange.start] = { startingDay: true, color: Colors.primary, textColor: Colors.black };

        if ((dateRange.start && !dateRange.end) || dateRange.start === dateRange.end)
            markedDates[dateRange.start] = { selected: true, color: Colors.primary, textColor: Colors.black };

        if (dateRange.end) {
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                const dateString = date.toISOString().split('T')[0];
                if (dateString !== dateRange.start && dateString !== dateRange.end) {
                    markedDates[dateString] = { color: Colors.dotsGray, textColor: Colors.black };
                }
            }

            if (dateRange.start !== dateRange.end) {
                markedDates[dateRange.end] = { endingDay: true, color: Colors.primary, textColor: Colors.black };
            }
        }

        return markedDates;
    }, [dateRange]);

    return (
        <Calendar
            markingType={'period'}
            maxDate={new Date().toISOString().split('T')[0]}
            markedDates={marked}
            onDayPress={handleDayPress}
            monthFormat={'yyyy MMM'}
            hideExtraDays={false}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            enableSwipeMonths={true}
        />
    );
};

export default React.memo(DatePicker);

const styles = StyleSheet.create({
    content: {
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 18,
        marginBottom: 24,
    },
});
