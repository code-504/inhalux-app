import React, { useEffect, useMemo, useRef, useState, useCallback, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import { MontserratSemiText } from './StyledText';
import BlurredBackground from './BlurredBackground';
import Colors from '@/constants/Colors';
import { Button } from 'tamagui';

import BottomIcon from "@/assets/icons/chevron_bottom.svg"

interface DatePickerProps {
    startRange ?: Date,
    endRange ?: Date,
    onDateChange?: (startDate: string | null, endDate: string | null) => void;
}

const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  };
  

const DatePicker = ({ startRange, endRange, onDateChange }: DatePickerProps) => {
    const dateModalRef = useRef<BottomSheetModal>(null);
    const dateFormatter = new Intl.DateTimeFormat('es-ES', options);

    const dateSnapPoints = useMemo(() => ['55%'], []);
    const [selectedStartDate, setSelectedStartDate] = useState<string | null>(startRange ? startRange.toISOString().split("T")[0] : new Date(Date.now()).toISOString().split("T")[0]);
    const [selectedEndDate, setSelectedEndDate] = useState<string | null>(endRange ? endRange.toISOString().split("T")[0] : null);

    const handleDayPress = useCallback(
        (day) => {
        if (!selectedStartDate || (selectedEndDate && day.dateString < selectedStartDate)) {
            setSelectedStartDate(day.dateString);
            setSelectedEndDate(null);
            onDateChange && onDateChange(day.dateString, null);
        } else if (!selectedEndDate && day.dateString >= selectedStartDate) {
            if (day.dateString === selectedStartDate) {
            setSelectedStartDate(day.dateString);
            setSelectedEndDate(null);
            onDateChange && onDateChange(day.dateString, null);
            } else {
            // Check if the date range is within 60 days
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(day.dateString);
            const dateDifference = Math.abs((endDate - startDate) / (24 * 60 * 60 * 1000));
            
            if (dateDifference <= 60) {
                setSelectedEndDate(day.dateString);
                onDateChange && onDateChange(selectedStartDate, day.dateString);
            } else {
                // Display an error or handle the situation where the range is too large
                console.warn('Date range exceeds 60 days limit');
            }
            }
        } else {
            setSelectedStartDate(day.dateString);
            setSelectedEndDate(null);
            onDateChange && onDateChange(day.dateString, null);
        }
        },
        [selectedStartDate, selectedEndDate]
    );

    const marked = useMemo(() => {
        const markedDates = {};

        if (selectedStartDate)
            markedDates[selectedStartDate] = { startingDay: true, color: Colors.primary, textColor: Colors.black };

        if ((selectedStartDate && !selectedEndDate) || selectedStartDate === selectedEndDate)
            markedDates[selectedStartDate] = { selected: true, color: Colors.primary, textColor: Colors.black };

        if (selectedEndDate) {
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                const dateString = currentDate.toISOString().split('T')[0];
                if (dateString !== selectedStartDate && dateString !== selectedEndDate) {
                    markedDates[dateString] = { color: Colors.dotsGray, textColor: Colors.black };
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (selectedStartDate !== selectedEndDate) markedDates[selectedEndDate] = { endingDay: true, color: Colors.primary, textColor: Colors.black };
        }

        return markedDates;
    }, [selectedStartDate, selectedEndDate]);

    const openBottomSheet = useCallback(() => {
        dateModalRef.current?.present();
    }, []);

    return (
        <View>
            <Button size="$6" backgroundColor={Colors.lightGrey} borderRadius={100} fontSize={14} onPress={openBottomSheet}>{`${selectedStartDate && dateFormatter.format(new Date(selectedStartDate))}` + (selectedEndDate ? ` - ${dateFormatter.format(new Date(selectedEndDate))}` : ``)}<BottomIcon /></Button>
            <BottomSheetModal
                ref={dateModalRef}
                snapPoints={dateSnapPoints}
                backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
                <BlurredBackground {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior={'close'} />
                )}
            >
                <View style={styles.content}>
                    <MontserratSemiText style={styles.title}>Elija una fecha un rango de fechas</MontserratSemiText>
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
                </View>
            </BottomSheetModal>
        </View>
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
