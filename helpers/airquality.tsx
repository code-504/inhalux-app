
// 24 horas (ug/m3)
const pm2_5 = {
    'Bueno': [0, 25],
    'Aceptable': [25.1, 37.5],
    'Moderado': [37.6, 50],
    'Insalubre para grupos sensibles': [50.1, 75],
    'Insalubre': [75.1, Infinity],
};

// 24 horas (ug/m3)
const pm10 = {
    'Bueno': [0, 50],
    'Aceptable': [50.1, 75],
    'Moderado': [75.1, 100],
    'Insalubre para grupos sensibles': [100.1, 150],
    'Insalubre': [150.1, Infinity],
};

// Co 8 horas
const co = {
    'Bueno': [0, 7],
    'Aceptable': [9.1, 10],
    'Insalubre': [10.1, Infinity]
};

// 1 hora Dioxido de nitrógeno
const no2 = {
    'Bueno': [0, 40],
    'Aceptable': [40.1, 100],
    'Moderado': [100.1, 200],
    'Insalubre para grupos sensibles': [200.1, 300],
    'Insalubre': [300.1, 400],
    'Muy insalubre': [400.1, 1000],
    'Peligroso': [1000.1, Infinity],
}

// ozono o3
const o3 = {
    'Bueno': [0, 40],
    'Aceptable': [40.1, 100],
    'Moderado': [100.1, 200],
    'Insalubre para grupos sensibles': [200.1, 300],
    'Insalubre': [300.1, 400],
    'Muy insalubre': [400.1, 1000],
    'Peligroso': [1000.1, Infinity],
}