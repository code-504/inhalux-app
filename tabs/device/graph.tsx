import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import TabBarMultiple from '@/components/TabBarMultiple'
import { BarChart, yAxisSides } from 'react-native-gifted-charts'
import Colors from '@/constants/Colors'
import TabBarNew from '@/components/TabBarNew'
import { MontserratSemiText, MontserratText } from '@/components/StyledText'
import { Button } from 'tamagui'
import SimpleWeatherCard, { FillType } from '@/components/Card/SimpleWeatherCard'

import PillIcon from "@/assets/icons/pill.svg"
import InhalerIcon from "@/assets/icons/inhaler.svg";
import AirWareIcon from "@/assets/icons/airware.svg";
import HelpIcon from "@/assets/icons/help.svg"
import AqIcon from "@/assets/icons/aq.svg"
import HumIcon from "@/assets/icons/humidity_percentage.svg"
import CoIcon from "@/assets/icons/co.svg"
import TempIcon from "@/assets/icons/device_thermostat.svg"
import GasIcon from "@/assets/icons/gas_meter.svg"
import VOCIcon from "@/assets/icons/total_dissolved_solids.svg"
import AirUnit from "@/assets/icons/ac_unit.svg"

const GraphTab = () => {

    const barData = [
		{value: 3, label: '27 nov'},
		{value: 7, label: '28 nov'},
		{value: 5, label: '29 nov'},
		{value: 12, label: '30 nov'},
	];

	/*
		const barData = [
		{value: 30, label: '27 nov'},
		{value: 50, label: '28 nov'},
		{value: 10, label: '29 nov'},
		{value: 50, label: '30 nov'},
	];
	*/

	const screenWidth = Dimensions.get("window").width - 48;
    
  return (
    <TabBarNew>
						<TabBarNew.Item Icon={InhalerIcon} title='Inhalux' height={750}>
							<View style={stylesTab.content}>

								<View style={stylesTab.sectionView}>
									<View style={stylesTab.titleView}>
										<MontserratSemiText style={stylesTab.title}>Uso del inhalador</MontserratSemiText>
										<MontserratText style={stylesTab.description}>Ultima conexión hace 10 segundos</MontserratText>
									</View>

									<View style={stylesTab.oneBlock}>
										<SimpleWeatherCard Icon={PillIcon} color={Colors.greenLight} title='Inhalaciones desde la última recarga' value={132} type={FillType.outline} valueStyle={{ fontWeight: "bold", color: Colors.black }} />
									</View>
								</View>

								<View style={stylesTab.sectionView}>
									<View style={stylesTab.titleView}>
										<MontserratSemiText style={stylesTab.title}>Resumen de uso</MontserratSemiText>
									</View>

									<View>
										<View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
											<View style={{ marginTop: 14, width: 8, height: 8, borderRadius: 10, backgroundColor: "rgb(0, 106, 38)" }}></View>
											<View>
												<MontserratSemiText style={{ fontSize: 24 }}>10</MontserratSemiText>
												<MontserratText style={{ color: Colors.darkGray }}>Inhalaciones</MontserratText>
											</View>
										</View>
									</View>

									<View style={stylesTab.containerChart}>
						
										<BarChart
											data={barData}
											barWidth={42}
											cappedBars
											capColor={'rgb(0, 106, 38)'}
											capThickness={2}
											showGradient
											gradientColor={'rgba(0, 106, 38, 0.2)'}
											frontColor={'rgba(0, 106, 38, 0)'}
											width={screenWidth - 48}
											yAxisSide={yAxisSides.RIGHT}
											yAxisThickness={0}
											xAxisThickness={0}
											dashGap={15}
											dashWidth={7}
											maxValue={Math.max(...barData.map(item => item.value)) + 1}
											stepHeight={65}
											initialSpacing={30}
											spacing={35}
											noOfSections={5}
											rulesColor={Colors.borderColor}
											rulesThickness={1}
											disablePress
										/>
									</View>
								</View>
							</View>
						</TabBarNew.Item>

						<TabBarNew.Item Icon={AirWareIcon} title='Análisis' height={1325}>
							<View style={stylesTab.content}>
								<View style={stylesTab.sectionView}>
									<View style={stylesTab.titleContent}>
										<View style={stylesTab.titleView}>
											<MontserratSemiText style={stylesTab.title}>{`Información de\nla calidad del aire`}</MontserratSemiText>
											<MontserratText style={stylesTab.description}>Último análisis hace 1 minuto</MontserratText>
										</View>

										<Button style={stylesTab.grayButton} alignSelf="center" size="$6" circular onPress={() => {}}>
											<HelpIcon fill={Colors.black} />
										</Button>
									</View>
								</View>

								<View style={stylesTab.sectionView}>
									<View style={stylesTab.twoBlock}>
										<SimpleWeatherCard Icon={AirUnit} color={Colors.blueLight} title="Estado del aire" calification="Excelente" type={FillType.outline} />
									</View>

									<View style={stylesTab.twoBlock}>
										<SimpleWeatherCard Icon={AqIcon} color={Colors.pink} title="Calidad del aire" calification="Buena" value={25} medition='ppm' type={FillType.outline} />
										<SimpleWeatherCard Icon={CoIcon} color={Colors.blueLight} title="Monóxido de carbono" calification="Excelente" value={300} medition='ppm' type={FillType.outline} />
									</View>

									<View style={stylesTab.twoBlock}>
										<SimpleWeatherCard Icon={GasIcon} color={Colors.purpleLight} title="Gas" calification="Regular" value={125} medition='ppm' type={FillType.outline} />
										<SimpleWeatherCard Icon={VOCIcon} color={Colors.greenLight} title="VOC" calification="Bueno" value={50} medition='ppm' type={FillType.outline} />
									</View>

									<View style={stylesTab.twoBlock}>
										<SimpleWeatherCard Icon={TempIcon} color={Colors.brownLight} title="Temperatura" calification="Regluar" value={25} medition='°C' type={FillType.outline} />
										<SimpleWeatherCard Icon={HumIcon} color={Colors.blueLight} title="Humedad" calification="Excelente" value={35} medition='%' type={FillType.outline} />
									</View>
								</View>

								<View style={stylesTab.sectionView}>
									<View style={stylesTab.titleView}>
										<MontserratSemiText style={stylesTab.title}>Resumen del análisis</MontserratSemiText>
									</View>

									<TabBarMultiple>
										<TabBarMultiple.Item title='Calidad del aire'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.purple}
												capThickness={2}
												showGradient
												gradientColor={Colors.purpleLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='CO2'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.blue}
												capThickness={2}
												showGradient
												gradientColor={Colors.blueLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='Gas'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.purple}
												capThickness={2}
												showGradient
												gradientColor={Colors.pink}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='VOC'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.green}
												capThickness={2}
												showGradient
												gradientColor={Colors.greenLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='Temperatura'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.brown}
												capThickness={2}
												showGradient
												gradientColor={Colors.brownLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>

										<TabBarMultiple.Item title='Humedad'>

											<BarChart
												data={barData}
												barWidth={42}
												cappedBars
												capColor={Colors.blue}
												capThickness={2}
												showGradient
												gradientColor={Colors.cyanLight}
												frontColor={'rgba(0, 0, 0, 0)'}
												width={screenWidth - 48}
												yAxisSide={yAxisSides.RIGHT}
												yAxisThickness={0}
												xAxisThickness={0}
												dashGap={15}
												dashWidth={7}
												maxValue={Math.max(...barData.map(item => item.value)) + 1}
												stepHeight={65}
												initialSpacing={30}
												spacing={35}
												noOfSections={5}
												rulesColor={Colors.borderColor}
												rulesThickness={1}
												disablePress
											/>
										</TabBarMultiple.Item>
									</TabBarMultiple>
								</View>
							</View>
						</TabBarNew.Item>

					</TabBarNew>
  )
}

export default GraphTab


const stylesTab = StyleSheet.create({
	content: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		paddingVertical: 24,
		gap: 32,
	},
	sectionView: {
		display: "flex",
		flexDirection: "column",
		gap: 16,
	},
	titleView: {
		display: "flex",
		flexDirection: "column",
		gap: 4
	},
	titleContent: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	title: {
		fontSize: 18
	},
	description: {
		fontSize: 14,
		color: Colors.darkGray
	},
	oneBlock: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: Colors.white,
		borderRadius: 28,
		gap: 16
	},
	twoBlock: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 16
	},
	containerChart: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	chart: {
		marginVertical: 8,
	},
	grayButton: {
		backgroundColor: Colors.lightGrey
	},
})