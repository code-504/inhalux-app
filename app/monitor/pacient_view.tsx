import { View, ScrollView, Animated, StyleSheet, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
import NormalHeader from '@/components/Headers/NormalHeader';
import { Divider, Menu } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import Colors from '@/constants/Colors';
import { Avatar } from 'tamagui';
import AvatarImg from "@/assets/images/default_avatar.png"
import { MontserratSemiText, MontserratText } from '@/components/StyledText';
import TabBar from '@/components/TabBar';
import SimpleWeatherCard, { FillType } from '@/components/Card/SimpleWeatherCard';
import { BarChart, yAxisSides } from 'react-native-gifted-charts';

// Resources
import MoreIcon from "@/assets/icons/more_vert.svg"
import InhalerIcon from "@/assets/icons/inhaler_simple.svg" 
import TreatmentIcon from "@/assets/icons/prescriptions.svg" 
import PillIcon from "@/assets/icons/pill.svg"
import TagSelect, { Tag } from '@/components/TagSelect';

const screenWidth = Dimensions.get("window").width - 48;

const PacientViewPage = () => {

    const { pacient_id } = useLocalSearchParams();

    const [visible, setVisible] = useState(false);
    
    let scrollOffsetY = useRef(new Animated.Value(0)).current;
    
    const openMenu = () => setVisible(true);

	const closeMenu = () => setVisible(false);
    
	const barData = [
		{value: 3, label: '27 nov'},
		{value: 7, label: '28 nov'},
		{value: 5, label: '29 nov'},
		{value: 12, label: '30 nov'},
	];

	const [selected, setSelected] = useState<Tag>({ label: "todo", value: "all" })
	
    return (
        <View style={styles.safeAre}>

            <Stack.Screen options={{
                header: () => 
                    <NormalHeader positionHeader='absolute' title={ "Nombre Paciente" } animHeaderValue={scrollOffsetY}>
                            
                        <Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            contentStyle={{ backgroundColor: Colors.white, borderRadius: 18 }}
                            anchor={
                                <Ripple style={{ overflow: "hidden", height: 64, width: 64, backgroundColor: Colors.white, borderRadius: 60, display: "flex", justifyContent: "center", alignItems: "center" }}  onPress={openMenu}>
                                    <MoreIcon />
                                </Ripple>
                            }>
                            <Menu.Item leadingIcon="pencil" title="Editar" />
                            <Divider />
                            <Menu.Item leadingIcon="delete" title="Eliminar" />
                        </Menu>
                    </NormalHeader>
            }} />
            
            <ScrollView style={styles.scrollView}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
                    {useNativeDriver: false}
                )}
                showsVerticalScrollIndicator={false}
            >
				<View style={styles.avatarView}>
					<Avatar size="$14" circular>
                        <Avatar.Image
                            accessibilityLabel="user"
                            src={AvatarImg}
                        />
                        <Avatar.Fallback backgroundColor={Colors.dotsGray} />
                    </Avatar>

					<View style={styles.avatarTextView}>
						<MontserratSemiText style={styles.avatarName}>Jose Palacios Dávila</MontserratSemiText>
						<MontserratText>Primo</MontserratText>
					</View>
				</View>

				
					<TabBar headerPadding={24}>
						<TabBar.Item title='Inhaladores' Icon={InhalerIcon} height={755}>
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
						</TabBar.Item>

						<TabBar.Item title='Tratamiento' Icon={TreatmentIcon} height={500}>
							<View style={stylesTab.content}>
								<View>
									<MontserratSemiText>Historial</MontserratSemiText>
								</View>

								<View>
									<TagSelect 
										tags={[
											{label: "todo", value: "all"},
											{label: "aceptado", value: "accepted"},
											{label: "cancelado", value: "canceled"},
											{label: "pendiente", value: "pending"},
											{label: "rechazado", value: "denied"},
										]}
										selected={selected}
										setSelected={setSelected}
									/>
								</View>
							</View>	
						</TabBar.Item>
					</TabBar>

            </ScrollView>
        </View>
    )
}

export default PacientViewPage

const styles = StyleSheet.create({
    safeAre: {
        flex: 1,
		width: "100%",
        backgroundColor: Colors.white,
		paddingTop: 128
    },
	scrollView: {
		width: "100%"
	},
	content: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		paddingHorizontal: 24,
	},
	avatarView: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 32,
		gap: 16
	},
	avatarTextView: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		gap: 4
	},
	avatarName: {
		fontSize: 18
	}
})

const stylesTab = StyleSheet.create({
	content: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		paddingVertical: 24,
		paddingHorizontal: 24,
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