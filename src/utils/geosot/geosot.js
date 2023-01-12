/**
 * @Author: STILLMOREzzz
 * @Date: 2023-01-02
 * @Description: 北大提供的原始geosot相关代码
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-01-12 20:36
 * @FilePath: ztm-earth-vue3/src/utils/geosot/geosot.js
 */
import useCesium from "@/hooks/useCesium";
const Cesium = useCesium();

var SETTING = {
  AccessToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZDljNWU5MS1lNWZhLTQwZTctOThlNS0wNThhMTFjNGQ2NWQiLCJpZCI6MjI4MCwiaWF0IjoxNTMyNDMzNzI1fQ.oIJZWzAcX_Hl1xPppq1s6CYCFrWA8481Nhkov64DxUY"
};

var LON_LAT_TABLE = {
  0: 512,
  1: 256,
  2: 128,
  3: 64,
  4: 32,
  5: 16,
  6: 8,
  7: 4,
  8: 2,
  9: 1,
  10: 1 / 2,
  11: 1 / 4,
  12: 1 / 8,
  13: 1 / 16,
  14: 1 / 32,
  15: 1 / 64,
  16: 1 / 128,
  17: 1 / 256,
  18: 1 / 512,
  19: 1 / 1024,
  20: 1 / 2048,
  21: 1 / 5096
};

var LON_LAT_DMS_TABLE = {
  0: 512, //似乎用不上
  1: 256,
  2: 128,
  3: 64,
  4: 32,
  5: 16,
  6: 8,
  7: 4,
  8: 2,
  9: 1, //以上是度
  10: 32,
  11: 16,
  12: 8,
  13: 4,
  14: 2, //约4km
  15: 1, //以上是分 //约4km
  16: 32,
  17: 16,
  18: 8,
  19: 4,
  20: 2,
  21: 1,
  22: 1 / 2,
  23: 1 / 4,
  24: 1 / 8,
  25: 1 / 16,
  26: 1 / 32,
  27: 1 / 64,
  28: 1 / 128,
  29: 1 / 256,
  30: 1 / 512,
  31: 1 / 1024,
  32: 1 / 2048 //以上是秒
};

var HEIGHT_TABLE = {};

function create_table(max_height) {
  HEIGHT_TABLE[0] = max_height;
  for (var i = 1; i < 32; i++) {
    HEIGHT_TABLE[i] = HEIGHT_TABLE[i - 1] / 2;
  }
}

create_table(Math.pow(2, 25));

var HEIGHT_TABLE_UNDERGROUND = {};
function create_table_underground(max_height) {
  HEIGHT_TABLE_UNDERGROUND[0] = max_height;
  for (var i = 1; i <= 32; i++) {
    HEIGHT_TABLE_UNDERGROUND[i] = HEIGHT_TABLE_UNDERGROUND[i - 1] / 2;
  }
}

create_table_underground(Math.pow(2, 23));

//根据最大的经度/纬度差来计算LOD层级的
function compute_level(max_distance) {
  if (max_distance >= 128) return 5;
  else if (max_distance >= 32) return 7;
  else if (max_distance >= 16) return 8;
  else if (max_distance >= 4) return 10;
  else if (max_distance >= 1) return 12;
  else if (max_distance >= 0.2) return 14;
  else if (max_distance >= 0.05) return 16;
  else if (max_distance >= 0.01) return 19;
  else if (max_distance >= 0.005) return 21;
  else if (max_distance >= 0.0001) return 24;
  else if (max_distance >= 0.00001) return 26;
  else if (max_distance >= 0.000005) return 27;
  else return 28;
}
//粗略的根据层级来算多大网格的函数-段杰雄
//
function compute_degree(input_level) {
  if (input_level >= 20) return 0.0006;
  else if (input_level >= 19) return 0.0012;
  else if (input_level >= 18) return 0.0024;
  else if (input_level >= 17) return 0.0048;
  else if (input_level >= 16) return 0.0096;
  else if (input_level >= 15) return 0.0192;
  else if (input_level >= 14) return 0.0384;
  else if (input_level >= 13) return 0.0768;
  else if (input_level >= 12) return 0.1536;
  else if (input_level >= 11) return 0.3072;
  else if (input_level >= 10) return 0.6144;
  else if (input_level >= 9) return 1.2288;
  else if (input_level >= 7) return 4.9152;
  else return 0;
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// 里面编码操作全部为二进制

//只返回绝对值信息，比如说 -80°7′3″ 和 80°7′3″ 的返回结果是一样的
function get_deg_min_sec(degree) {
  degree = Math.abs(degree);
  let deg = Math.floor(degree);
  let minute = Math.floor(degree * 60 - deg * 60);
  let second = degree * 3600 - deg * 3600 - minute * 60;
  return [deg, minute, second];
}

//已改
/**
 *
 * @param level 网格层级
 * @param lat 纬度
 * @param lon 经度
 * @returns {string} 网格层级的二进制编码
 */
function encode_geosot_2d(level, lat, lon) {
  let lat_deg_min_sec = get_deg_min_sec(lat);
  let lon_deg_min_sec = get_deg_min_sec(lon);

  let lat_deg_bin = lat_deg_min_sec[0].toString(2);
  let lon_deg_bin = lon_deg_min_sec[0].toString(2); //直接把分钟的数字转化为二进制就是GeoSOT的经度/纬度方向编码了
  lat_deg_bin = Array(9 - lat_deg_bin.length).join("0") + lat_deg_bin;
  lon_deg_bin = Array(9 - lon_deg_bin.length).join("0") + lon_deg_bin; //前几位补0，一共补到二进制九位

  let lat_min_bin = lat_deg_min_sec[1].toString(2);
  let lon_min_bin = lon_deg_min_sec[1].toString(2);
  lat_min_bin = Array(7 - lat_min_bin.length).join("0") + lat_min_bin;
  lon_min_bin = Array(7 - lon_min_bin.length).join("0") + lon_min_bin;

  let lat_sec_bin = Math.floor(lat_deg_min_sec[2] / LON_LAT_DMS_TABLE[level]).toString(2);
  let lon_sec_bin = Math.floor(lon_deg_min_sec[2] / LON_LAT_DMS_TABLE[level]).toString(2);
  if (level > 15) {
    //b0 = Array(0).join('0');   -->  ''
    //b1 = Array(1).join('0');   -->  ''
    //b2 = Array(2).join('0');   -->  '0'
    //b3 = Array(3).join('0');   -->  '00'
    //应该是这块的问题，有时候补0补少了
    lat_sec_bin = Array(level + 1 - 15 - lat_sec_bin.length).join("0") + lat_sec_bin;
    lon_sec_bin = Array(level + 1 - 15 - lon_sec_bin.length).join("0") + lon_sec_bin;
  } else {
    lat_sec_bin = "";
    lon_sec_bin = "";
  }
  let lat_bin = lat_deg_bin.substr(0, 9) + lat_min_bin.substr(0, 7) + lat_sec_bin;
  let lon_bin = lon_deg_bin.substr(0, 9) + lon_min_bin.substr(0, 7) + lon_sec_bin;
  let lat_cap = lat >= 0 ? "0" : "1";
  let lon_cap = lon >= 0 ? "0" : "1";

  lat_bin = lat_cap + lat_bin;
  lon_bin = lon_cap + lon_bin;
  let code_array = Array();
  for (var i = 0; i < level; i++) {
    code_array.push(lat_bin[i]);
    code_array.push(lon_bin[i]);
  }
  return code_array.join("");
}

//已改
function encode_geosot_3d(level, lat, lon, height) {
  let lat_deg_min_sec = get_deg_min_sec(lat);
  let lon_deg_min_sec = get_deg_min_sec(lon);

  let lat_deg_bin = lat_deg_min_sec[0].toString(2);
  let lon_deg_bin = lon_deg_min_sec[0].toString(2); //直接把分钟的数字转化为二进制就是GeoSOT的经度/纬度方向编码了
  lat_deg_bin = Array(9 - lat_deg_bin.length).join("0") + lat_deg_bin;
  lon_deg_bin = Array(9 - lon_deg_bin.length).join("0") + lon_deg_bin; //前几位补0，一共补到二进制九位

  let lat_min_bin = lat_deg_min_sec[1].toString(2);
  let lon_min_bin = lon_deg_min_sec[1].toString(2);
  lat_min_bin = Array(7 - lat_min_bin.length).join("0") + lat_min_bin;
  lon_min_bin = Array(7 - lon_min_bin.length).join("0") + lon_min_bin;

  let lat_sec_bin = Math.floor(lat_deg_min_sec[2] / LON_LAT_DMS_TABLE[level]).toString(2);
  let lon_sec_bin = Math.floor(lon_deg_min_sec[2] / LON_LAT_DMS_TABLE[level]).toString(2);
  if (level > 15) {
    lat_sec_bin = Array(level + 1 - 15 - lat_sec_bin.length).join("0") + lat_sec_bin;
    lon_sec_bin = Array(level + 1 - 15 - lon_sec_bin.length).join("0") + lon_sec_bin;
  } else {
    lat_sec_bin = "";
    lon_sec_bin = "";
  }
  let lat_bin = lat_deg_bin.substr(0, 9) + lat_min_bin.substr(0, 7) + lat_sec_bin;
  let lon_bin = lon_deg_bin.substr(0, 9) + lon_min_bin.substr(0, 7) + lon_sec_bin;
  let height_bin;
  if (height > 0) {
    height_bin = Math.floor(Math.abs(height) / HEIGHT_TABLE[level]).toString(2);
  } else {
    height_bin = Math.floor(Math.abs(height) / HEIGHT_TABLE_UNDERGROUND[level]).toString(2);
  }
  height_bin = Array(level - height_bin.length).join("0") + height_bin;

  let lat_cap = lat >= 0 ? "0" : "1";
  let lon_cap = lon >= 0 ? "0" : "1";
  let height_cap = height >= 0 ? "0" : "1";

  lat_bin = lat_cap + lat_bin;
  lon_bin = lon_cap + lon_bin;
  height_bin = height_cap + height_bin;
  let code_array = Array();
  for (var i = 0; i < level; i++) {
    code_array.push(lat_bin[i]);
    code_array.push(lon_bin[i]);
    code_array.push(height_bin[i]);
  }
  return code_array.join("");
}

//前几位是度（大于180、360的取回180、360），中间几位取出来转为整数的分（大于60的取回60），后边转为整数的秒
//这里边对应的是二维编码
//已改
function decode_geosot_2d(code) {
  console.assert(code.length % 2 === 0 && code.length > 2);
  let level = code.length / 2;
  let part_label = 0;
  let latArray_degree = Array();
  let lonArray_degree = Array();
  let latArray_minute = Array();
  let lonArray_minute = Array();
  let latArray_second = Array();
  let lonArray_second = Array();
  let heightArray = Array();
  //注意这块儿是从2开始的，不是从0开始的
  for (var i = 2; i < code.length; i++) {
    if (i % 2 === 0) {
      if (part_label < 9 - 1) {
        latArray_degree.push(code[i]);
      } else if (part_label < 15 - 1) {
        latArray_minute.push(code[i]);
      } else {
        latArray_second.push(code[i]);
      }
    } else if (i % 2 === 1) {
      if (part_label < 9 - 1) {
        lonArray_degree.push(code[i]);
      } else if (part_label < 15 - 1) {
        lonArray_minute.push(code[i]);
      } else {
        lonArray_second.push(code[i]);
      }
      part_label = part_label + 1;
    }
  }
  let latString_degree = latArray_degree.join("");
  let lonString_degree = lonArray_degree.join("");
  let latString_minute = latArray_minute.join("");
  let lonString_minute = lonArray_minute.join("");
  let latString_second = latArray_second.join("");
  let lonString_second = lonArray_second.join("");
  let heightString = heightArray.join("");
  let latInt_degree, lonInt_degree, latInt_minute, lonInt_minute, latInt_second, lonInt_second;
  if (lonString_degree.length > 0) {
    latInt_degree = parseInt(latString_degree, 2);
    lonInt_degree = parseInt(lonString_degree, 2);
  } else {
    latInt_degree = 0;
    lonInt_degree = 0;
  }
  if (lonString_minute.length > 0) {
    latInt_minute = parseInt(latString_minute, 2);
    lonInt_minute = parseInt(lonString_minute, 2);
  } else {
    latInt_minute = 0;
    lonInt_minute = 0;
  }
  if (lonString_second.length > 0) {
    latInt_second = parseInt(latString_second, 2);
    lonInt_second = parseInt(lonString_second, 2);
  } else {
    latInt_second = 0;
    lonInt_second = 0;
  }

  let latminute_part_min =
    latInt_minute * LON_LAT_DMS_TABLE[level < 15 ? level : 15] > 60
      ? 60
      : latInt_minute * LON_LAT_DMS_TABLE[level < 15 ? level : 15];
  let lonminute_part_min =
    lonInt_minute * LON_LAT_DMS_TABLE[level < 15 ? level : 15] > 60
      ? 60
      : lonInt_minute * LON_LAT_DMS_TABLE[level < 15 ? level : 15];
  let latsecond_part_min =
    latInt_second * LON_LAT_DMS_TABLE[level] > 60 ? 60 : latInt_second * LON_LAT_DMS_TABLE[level];
  let lonsecond_part_min =
    lonInt_second * LON_LAT_DMS_TABLE[level] > 60 ? 60 : lonInt_second * LON_LAT_DMS_TABLE[level];

  let unlatMin =
    latInt_degree * LON_LAT_DMS_TABLE[level < 9 ? level : 9] +
    latminute_part_min / 60 +
    latsecond_part_min / 3600;
  let unlonMin =
    lonInt_degree * LON_LAT_DMS_TABLE[level < 9 ? level : 9] +
    lonminute_part_min / 60 +
    lonsecond_part_min / 3600;
  let unlatMax, unlonMax;
  if (level <= 9) {
    //unlonMax 这些的里的un是没有符号的意思
    unlatMax = (latInt_degree + 1) * LON_LAT_DMS_TABLE[level];
    unlonMax = (lonInt_degree + 1) * LON_LAT_DMS_TABLE[level];
    unlatMax = unlatMax < 90 ? unlatMax : 90;
    unlonMax = unlonMax < 180 ? unlonMax : 180;
  } else if (level <= 15) {
    let latminute_part_max =
      (latInt_minute + 1) * LON_LAT_DMS_TABLE[level] > 60
        ? 60
        : (latInt_minute + 1) * LON_LAT_DMS_TABLE[level];
    let lonminute_part_max =
      (lonInt_minute + 1) * LON_LAT_DMS_TABLE[level] > 60
        ? 60
        : (lonInt_minute + 1) * LON_LAT_DMS_TABLE[level];
    unlatMax = latInt_degree * LON_LAT_DMS_TABLE[9] + latminute_part_max / 60;
    unlonMax = lonInt_degree * LON_LAT_DMS_TABLE[9] + lonminute_part_max / 60;
  } else {
    let latsecond_part_max =
      (latInt_second + 1) * LON_LAT_DMS_TABLE[level] > 60
        ? 60
        : (latInt_second + 1) * LON_LAT_DMS_TABLE[level];
    let lonsecond_part_max =
      (lonInt_second + 1) * LON_LAT_DMS_TABLE[level] > 60
        ? 60
        : (lonInt_second + 1) * LON_LAT_DMS_TABLE[level];
    unlatMax =
      latInt_degree * LON_LAT_DMS_TABLE[9] +
      (latInt_minute * LON_LAT_DMS_TABLE[15]) / 60 +
      latsecond_part_max / 3600;
    unlonMax =
      lonInt_degree * LON_LAT_DMS_TABLE[9] +
      (lonInt_minute * LON_LAT_DMS_TABLE[15]) / 60 +
      lonsecond_part_max / 3600;
  }

  let latMin = code[0] === "1" ? -unlatMax : unlatMin;
  let lonMin = code[1] === "1" ? -unlonMax : unlonMin;
  let latMax = code[0] === "1" ? -unlatMin : unlatMax;
  let lonMax = code[1] === "1" ? -unlonMin : unlonMax;

  latMin = latMin < -90 ? -90 : latMin;
  lonMin = lonMin < -180 ? -180 : lonMin;
  latMax = latMax > 90 ? 90 : latMax;
  lonMax = lonMax > 180 ? 180 : lonMax;

  return {
    level: level,
    min_coord: [latMin, lonMin],
    max_coord: [latMax, lonMax]
  };
}
//前几位是度（大于180、360的取回180、360），中间几位取出来转为整数的分（大于60的取回60），后边转为整数的秒
//已改
function decode_geosot_3d(code) {
  // console.assert(code.length % 3 === 0 && code.length > 3);
  let level = code.length / 3;
  let part_label = 0;
  let latArray_degree = Array();
  let lonArray_degree = Array();
  let latArray_minute = Array();
  let lonArray_minute = Array();
  let latArray_second = Array();
  let lonArray_second = Array();
  let heightArray = Array();
  //注意这块儿是从3开始的，不是从0开始的
  for (var i = 3; i < code.length; i++) {
    if (i % 3 === 0) {
      if (part_label < 9 - 1) {
        latArray_degree.push(code[i]);
      } else if (part_label < 15 - 1) {
        latArray_minute.push(code[i]);
      } else {
        latArray_second.push(code[i]);
      }
    } else if (i % 3 === 1) {
      if (part_label < 9 - 1) {
        lonArray_degree.push(code[i]);
      } else if (part_label < 15 - 1) {
        lonArray_minute.push(code[i]);
      } else {
        lonArray_second.push(code[i]);
      }
      part_label = part_label + 1;
    } else {
      heightArray.push(code[i]);
    }
  }
  let latString_degree = latArray_degree.join("");
  let lonString_degree = lonArray_degree.join("");
  let latString_minute = latArray_minute.join("");
  let lonString_minute = lonArray_minute.join("");
  let latString_second = latArray_second.join("");
  let lonString_second = lonArray_second.join("");
  let heightString = heightArray.join("");
  let latInt_degree, lonInt_degree, latInt_minute, lonInt_minute, latInt_second, lonInt_second;
  if (lonString_degree.length > 0) {
    latInt_degree = parseInt(latString_degree, 2);
    lonInt_degree = parseInt(lonString_degree, 2);
  } else {
    latInt_degree = 0;
    lonInt_degree = 0;
  }
  if (lonString_minute.length > 0) {
    latInt_minute = parseInt(latString_minute, 2);
    lonInt_minute = parseInt(lonString_minute, 2);
  } else {
    latInt_minute = 0;
    lonInt_minute = 0;
  }
  if (lonString_second.length > 0) {
    latInt_second = parseInt(latString_second, 2);
    lonInt_second = parseInt(lonString_second, 2);
  } else {
    latInt_second = 0;
    lonInt_second = 0;
  }

  let latminute_part_min =
    latInt_minute * LON_LAT_DMS_TABLE[level < 15 ? level : 15] > 60
      ? 60
      : latInt_minute * LON_LAT_DMS_TABLE[level < 15 ? level : 15];
  let lonminute_part_min =
    lonInt_minute * LON_LAT_DMS_TABLE[level < 15 ? level : 15] > 60
      ? 60
      : lonInt_minute * LON_LAT_DMS_TABLE[level < 15 ? level : 15];
  let latsecond_part_min =
    latInt_second * LON_LAT_DMS_TABLE[level] > 60 ? 60 : latInt_second * LON_LAT_DMS_TABLE[level];
  let lonsecond_part_min =
    lonInt_second * LON_LAT_DMS_TABLE[level] > 60 ? 60 : lonInt_second * LON_LAT_DMS_TABLE[level];

  let unlatMin =
    latInt_degree * LON_LAT_DMS_TABLE[level < 9 ? level : 9] +
    latminute_part_min / 60 +
    latsecond_part_min / 3600;
  let unlonMin =
    lonInt_degree * LON_LAT_DMS_TABLE[level < 9 ? level : 9] +
    lonminute_part_min / 60 +
    lonsecond_part_min / 3600;
  let unlatMax, unlonMax;
  if (level <= 9) {
    //unlonMax 这些的里的un是没有符号的意思
    unlatMax = (latInt_degree + 1) * LON_LAT_DMS_TABLE[level];
    unlonMax = (lonInt_degree + 1) * LON_LAT_DMS_TABLE[level];
    unlatMax = unlatMax < 90 ? unlatMax : 90;
    unlonMax = unlonMax < 180 ? unlonMax : 180;
  } else if (level <= 15) {
    let latminute_part_max =
      (latInt_minute + 1) * LON_LAT_DMS_TABLE[level] > 60
        ? 60
        : (latInt_minute + 1) * LON_LAT_DMS_TABLE[level];
    let lonminute_part_max =
      (lonInt_minute + 1) * LON_LAT_DMS_TABLE[level] > 60
        ? 60
        : (lonInt_minute + 1) * LON_LAT_DMS_TABLE[level];
    unlatMax = latInt_degree * LON_LAT_DMS_TABLE[9] + latminute_part_max / 60;
    unlonMax = lonInt_degree * LON_LAT_DMS_TABLE[9] + lonminute_part_max / 60;
  } else {
    let latsecond_part_max =
      (latInt_second + 1) * LON_LAT_DMS_TABLE[level] > 60
        ? 60
        : (latInt_second + 1) * LON_LAT_DMS_TABLE[level];
    let lonsecond_part_max =
      (lonInt_second + 1) * LON_LAT_DMS_TABLE[level] > 60
        ? 60
        : (lonInt_second + 1) * LON_LAT_DMS_TABLE[level];
    unlatMax =
      latInt_degree * LON_LAT_DMS_TABLE[9] +
      (latInt_minute * LON_LAT_DMS_TABLE[15]) / 60 +
      latsecond_part_max / 3600;
    unlonMax =
      lonInt_degree * LON_LAT_DMS_TABLE[9] +
      (lonInt_minute * LON_LAT_DMS_TABLE[15]) / 60 +
      lonsecond_part_max / 3600;
  }

  let latMin = code[0] === "0" ? unlatMin : -unlatMax;
  let lonMin = code[1] === "0" ? unlonMin : -unlonMax;
  let latMax = code[0] === "0" ? unlatMax : -unlatMin;
  let lonMax = code[1] === "0" ? unlonMax : -unlonMin;

  let heightInt = parseInt(heightString, 2);
  let heightResolution = HEIGHT_TABLE[level];
  let heightResolution_Underground = HEIGHT_TABLE_UNDERGROUND[level];

  //再次修改
  let heightMin =
    code[2] === "0"
      ? heightInt * heightResolution
      : -heightInt * heightResolution_Underground - heightResolution_Underground;
  let heightMax =
    code[2] === "0"
      ? heightInt * heightResolution + heightResolution
      : -heightInt * heightResolution_Underground;

  latMin = latMin < -90 ? -90 : latMin;
  lonMin = lonMin < -180 ? -180 : lonMin;
  lonMin = lonMin > 180 ? 180 : lonMin;
  latMax = latMax > 90 ? 90 : latMax;
  lonMax = lonMax > 180 ? 180 : lonMax;

  return {
    level: level,
    min_coord: [latMin, lonMin, heightMin],
    max_coord: [latMax, lonMax, heightMax]
  };
}

function style_selection(style) {
  if (style == -1) {
    return Cesium.Color.fromRandom({
      minimumRed: 0.5,
      minimumGreen: 0.5,
      minimumBlue: 0.5,
      maximumRed: 1.0,
      maximumGreen: 1.0,
      maximumBlue: 1.0,
      alpha: 0.9
    });
  }
  //style在0--1之间
  let red = style;
  let green = 1 - style;
  let blue = (1 - style) * 0.5;
  let alpha = 0.8;
  let material_color = new Cesium.Color(red, green, blue, alpha);
  return material_color;
}

// 绘制三维网格
//用于把instances和instances_outline内增加
function draw_primitive_code(
  viewer,
  code,
  instances,
  instances_outline,
  material = Cesium.Color.RED.withAlpha(0.2)
) {
  let codeRange = decode_geosot_3d(code);

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 90 ||
    codeRange.max_coord[0] <= -90 ||
    codeRange.min_coord[1] >= 180 ||
    codeRange.max_coord[1] <= -180
  )
    return;

  let lat_min = codeRange.min_coord[0];
  let lon_min = codeRange.min_coord[1];
  let lat_max = codeRange.max_coord[0];
  let lon_max = codeRange.max_coord[1];

  if (!material) {
    material = Cesium.Color.fromRandom({
      minimumRed: 0.1,
      minimumGreen: 0.1,
      minimumBlue: 0.1,
      maximumRed: 0.5,
      maximumGreen: 0.5,
      maximumBlue: 0.8,
      alpha: 0.2
    });
  }
  //只有在地面上有东西之后，在地下画一个小东西才会能够显示出来
  instances.push(
    new Cesium.GeometryInstance({
      //name: code,
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max),
        height: codeRange.min_coord[2],
        extrudedHeight: codeRange.max_coord[2]
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(material)
      }
    })
  );
  instances_outline.push(
    new Cesium.GeometryInstance({
      geometry: Cesium.PolygonOutlineGeometry.createGeometry(
        Cesium.PolygonOutlineGeometry.fromPositions({
          positions: Cesium.Cartesian3.fromDegreesArray([
            lon_min,
            lat_min,
            lon_min,
            lat_max,
            lon_max,
            lat_max,
            lon_max,
            lat_min
          ]),
          height: codeRange.min_coord[2],
          extrudedHeight: codeRange.max_coord[2]
        })
      ),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOW)
      }
    })
  );
}

//目前这个函数只能画某一种颜色的网格，如果想用纹理或者其他的填充形式，需要改函数里的attributes
function draw_primitive_code_2d(
  viewer,
  code,
  instances,
  instances_outline,
  material = Cesium.Color.RED.withAlpha(0.2)
) {
  let codeRange = decode_geosot_2d(code);

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 90 ||
    codeRange.max_coord[0] <= -90 ||
    codeRange.min_coord[1] >= 180 ||
    codeRange.max_coord[1] <= -180
  )
    return;

  let lat_min = codeRange.min_coord[0];
  let lon_min = codeRange.min_coord[1];
  let lat_max = codeRange.max_coord[0];
  let lon_max = codeRange.max_coord[1];

  //只有在地面上有东西之后，在地下画一个小东西才会能够显示出来
  instances.push(
    new Cesium.GeometryInstance({
      //name: code,
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max)
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(material)
      }
    })
  );
  instances_outline.push(
    new Cesium.GeometryInstance({
      geometry: Cesium.PolygonOutlineGeometry.createGeometry(
        Cesium.PolygonOutlineGeometry.fromPositions({
          positions: Cesium.Cartesian3.fromDegreesArray([
            lon_min,
            lat_min,
            lon_min,
            lat_max,
            lon_max,
            lat_max,
            lon_max,
            lat_min
          ])
        })
      ),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOW)
      }
    })
  );
}

//根据二维编码画二维图
//未测
function draw_code_2d(
  viewer,
  code_2d,
  material = Cesium.Color.RED.withAlpha(0.2),
  code_collection = null,
  parents_grids = null
) {
  let codeRange = decode_geosot_2d(code_2d);

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 90 ||
    codeRange.max_coord[0] <= -90 ||
    codeRange.min_coord[1] >= 180 ||
    codeRange.max_coord[1] <= -180
  )
    return;

  let lat_min = codeRange.min_coord[0];
  let lon_min = codeRange.min_coord[1];
  let lat_max = codeRange.max_coord[0];
  let lon_max = codeRange.max_coord[1];

  if (!material) {
    material = Cesium.Color.fromRandom({
      minimumRed: 0.1,
      minimumGreen: 0.1,
      minimumBlue: 0.1,
      maximumRed: 0.5,
      maximumGreen: 0.5,
      maximumBlue: 0.8,
      alpha: 0.2
    });
  }

  var temp = new Cesium.Entity({
    name: code_2d,
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max),
      material: material,
      outline: true,
      outlineColor: Cesium.Color.YELLOW
    }
  });
  if (code_collection) {
    code_collection.add(temp);
  }
  if (parents_grids) {
    temp.parent = parents_grids;
  }
  viewer.entities.add(temp);
}

//画单个网格
//viewer: Cesium的基本变量
//code: 三维编码
//material: 网格的颜色材质
//code_collection: 网格所在的集合，利用该集合可以便于对网格进行管理(例如删除的话直接写code_collection.values=[];即可)
//parent_grids: 函数所绘制的网格的父网格，可以利用这个parent_grids的show进行管理显示、不显示
function draw_code_1(viewer, code, storage, parent_grids, style = 0, color, material) {
  //let codeRange = decode(code);
  let codeRange = decode_geosot_3d(code);

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 180 ||
    codeRange.max_coord[0] <= -180 ||
    codeRange.min_coord[1] >= 90 ||
    codeRange.max_coord[1] <= -90
  )
    return;

  let lon_min = codeRange.min_coord[0];
  let lat_min = codeRange.min_coord[1];
  let lon_max = codeRange.max_coord[0];
  let lat_max = codeRange.max_coord[1];

  var temp = viewer.entities.add({
    name: code,
    parent: parent_grids,
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max),
      material: material,
      extrudedHeight: codeRange.max_coord[2],
      height: codeRange.min_coord[2],
      outline: true,
      outlineColor: color
    }
  });
  storage.push(temp);
}
function draw_code(
  viewer,
  code,
  material = Cesium.Color.RED.withAlpha(0.2),
  code_collection = null,
  parents_grids = null
) {
  let codeRange = decode_geosot_3d(code);

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 90 ||
    codeRange.max_coord[0] <= -90 ||
    codeRange.min_coord[1] >= 180 ||
    codeRange.max_coord[1] <= -180
  )
    return;

  let lat_min = codeRange.min_coord[0];
  let lon_min = codeRange.min_coord[1];
  let lat_max = codeRange.max_coord[0];
  let lon_max = codeRange.max_coord[1];

  if (!material) {
    material = Cesium.Color.fromRandom({
      minimumRed: 0.1,
      minimumGreen: 0.1,
      minimumBlue: 0.1,
      maximumRed: 0.5,
      maximumGreen: 0.5,
      maximumBlue: 0.8,
      alpha: 0.2
    });
  }
  var temp = new Cesium.Entity({
    name: code,
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max),
      material: material,
      extrudedHeight: codeRange.max_coord[2],
      height: codeRange.min_coord[2],
      outline: true,
      outlineColor: Cesium.Color.YELLOW
    }
  });
  if (code_collection) {
    code_collection.add(temp);
  }
  if (parents_grids) {
    temp.parent = parents_grids;
  }
  viewer.entities.add(temp);
}

//画单个动态网格
//viewer: Cesium的基本变量
//code: 三维编码
//material: 网格的颜色材质
//code_collection: 网格所在的集合
//parent_grids: 函数所绘制的网格的父网格
//starttime stoptime 该网格的有效的时间的起止时刻，如果不写的话，可能就不显示了
//时间的格式：Cesium.JulianDate.fromIso8601('1980-08-01T00:00:00Z')
function draw_dynamic_code(
  viewer,
  code,
  material = Cesium.Color.RED.withAlpha(0.2),
  code_collection = null,
  parents_grids = null,
  starttime = null,
  stoptime = null
) {
  let codeRange = decode_geosot_3d(code);

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 90 ||
    codeRange.max_coord[0] <= -90 ||
    codeRange.min_coord[1] >= 180 ||
    codeRange.max_coord[1] <= -180
  )
    return;

  let lat_min = codeRange.min_coord[0];
  let lon_min = codeRange.min_coord[1];
  let lat_max = codeRange.max_coord[0];
  let lon_max = codeRange.max_coord[1];

  if (!material) {
    material = Cesium.Color.fromRandom({
      minimumRed: 0.1,
      minimumGreen: 0.1,
      minimumBlue: 0.1,
      maximumRed: 0.5,
      maximumGreen: 0.5,
      maximumBlue: 0.8,
      alpha: 0.2
    });
  }
  var temp = new Cesium.Entity({
    name: code,
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max),
      material: material,
      extrudedHeight: codeRange.max_coord[2],
      height: codeRange.min_coord[2],
      outline: true,
      outlineColor: Cesium.Color.YELLOW
    },
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: starttime,
        stop: stoptime
      })
    ])
  });
  if (code_collection) {
    code_collection.add(temp);
  }
  if (parents_grids) {
    temp.parent = parents_grids;
  }
  viewer.entities.add(temp);
}

function draw_codes(
  viewer,
  level,
  lat_range,
  lon_range,
  height_range,
  material = Cesium.Color.WHITE.withAlpha(0),
  code_collection = null,
  parents_grids = null
) {
  let lat_min = lat_range ? lat_range[0] : -90;
  let lat_max = lat_range ? lat_range[1] : 90;
  let lon_min = lon_range ? lon_range[0] : -180;
  let lon_max = lon_range ? lon_range[1] : 180;
  let height_min = height_range ? height_range[0] : 0;
  let height_max = height_range ? height_range[1] : Math.pow(2, 23);

  let d_increase = 0.0000001; //微微增加一个小量
  let code_min = encode_geosot_3d(
    level,
    lat_min + d_increase,
    lon_min + d_increase,
    height_min + d_increase
  );
  let code_max = encode_geosot_3d(
    level,
    lat_max - d_increase,
    lon_max - d_increase,
    height_max - d_increase
  );

  let latArray_min = Array();
  let lonArray_min = Array();
  let heightArray_min = Array();
  let latArray_max = Array();
  let lonArray_max = Array();
  let heightArray_max = Array();
  //注意这块儿是从3开始的，不是从0开始的
  for (var i = 3; i < code_min.length; i++) {
    if (i % 3 === 0) {
      latArray_min.push(code_min[i]);
      latArray_max.push(code_max[i]);
    } else if (i % 3 === 1) {
      lonArray_min.push(code_min[i]);
      lonArray_max.push(code_max[i]);
    } else {
      heightArray_min.push(code_min[i]);
      heightArray_max.push(code_max[i]);
    }
  }
  let latString_min = latArray_min.join("");
  let latString_max = latArray_max.join("");
  let lonString_min = lonArray_min.join("");
  let lonString_max = lonArray_max.join("");
  let heightString_min = heightArray_min.join("");
  let heightString_max = heightArray_max.join("");
  let latInt_min = parseInt(latString_min, 2);
  let lonInt_min = parseInt(lonString_min, 2);
  let heightInt_min = parseInt(heightString_min, 2);
  let latInt_max = parseInt(latString_max, 2);
  let lonInt_max = parseInt(lonString_max, 2);
  let heightInt_max = parseInt(heightString_max, 2);

  //这块的转化，把负的编码（首位为0）的值减了1，是为了避免类似100 和 000在去掉首位后都一样的情况（那样的话实际上在绘制的时候就少绘制了一个）
  //后边再把数字转编码的时候记得加回来。
  latInt_min = code_min[0] == "0" ? latInt_min : -latInt_min - 1;
  lonInt_min = code_min[1] == "0" ? lonInt_min : -lonInt_min - 1;
  heightInt_min = code_min[2] == "0" ? heightInt_min : -heightInt_min - 1;
  latInt_max = code_max[0] == "0" ? latInt_max : -latInt_max - 1;
  lonInt_max = code_max[1] == "0" ? lonInt_max : -lonInt_max - 1;
  heightInt_max = code_max[2] == "0" ? heightInt_max : -heightInt_max - 1;

  for (var lonInt = lonInt_min; lonInt <= lonInt_max; lonInt += 1) {
    for (var latInt = latInt_min; latInt <= latInt_max; latInt += 1) {
      for (var heightInt = heightInt_min; heightInt <= heightInt_max; heightInt += 1) {
        let latString, lonString, heightString;
        if (latInt >= 0) {
          latString = latInt.toString(2);
          latString = Array(level - latString.length).join("0") + latString; //因为不论是"000111"还是"00111"还是"0111"还是"111"，对应到整数都是7
        } else {
          latString = Math.abs(latInt + 1).toString(2);
          latString = Array(level - latString.length).join("0") + latString;
        }
        if (lonInt >= 0) {
          lonString = lonInt.toString(2);
          lonString = Array(level - lonString.length).join("0") + lonString;
        } else {
          lonString = Math.abs(lonInt + 1).toString(2);
          lonString = Array(level - lonString.length).join("0") + lonString;
        }
        if (heightInt >= 0) {
          heightString = heightInt.toString(2);
          heightString = Array(level - heightString.length).join("0") + heightString;
        } else {
          heightString = Math.abs(heightInt + 1).toString(2);
          heightString = Array(level - heightString.length).join("0") + heightString;
        }
        let code = "";
        if (latInt >= 0) {
          code = code.concat("0");
        } else {
          code = code.concat("1");
        }
        if (lonInt >= 0) {
          code = code.concat("0");
        } else {
          code = code.concat("1");
        }
        if (heightInt >= 0) {
          code = code.concat("0");
        } else {
          code = code.concat("1");
        }
        for (i = 0; i < level - 1; i++) {
          //用level-1而不用level，因为三个字符串的实际上第一位都是用于存正负的，之前加过了。
          code = code.concat(latString[i]);
          code = code.concat(lonString[i]);
          code = code.concat(heightString[i]);
        }
        draw_code(viewer, code, material, code_collection, parents_grids);
      }
    }
  }
}

//用画线的方式画二维网格，因为原来的画网格方式比较慢，如果只希望加载网格(框架)而不是网格的面的话，就用这种方式更好
//near 和 far规定了能看到这条线的最近、最远距离
function draw_codes_2d_line(
  viewer,
  level,
  lon_range,
  lat_range,
  near = 0.0,
  far = Number.MAX_VALUE,
  material = Cesium.Color.WHITE.withAlpha(0.2)
) {
  let lonlatResolution = LON_LAT_TABLE[level];
  let lat_min = lat_range ? lat_range[0] : -90;
  let lat_max = lat_range ? lat_range[1] : 90;
  let lon_min = lon_range ? lon_range[0] : -180;
  let lon_max = lon_range ? lon_range[1] : 180;

  let d_increase = 0.0000001; //微微增加一个小量
  let code_min = encode_geosot_2d(level, lat_min + d_increase, lon_min + d_increase); //左下角
  let code_max = encode_geosot_2d(level, lat_max - d_increase, lon_max - d_increase); //右上角

  let latArray_min = Array();
  let lonArray_min = Array();
  let lonArray_max = Array();
  let latArray_max = Array();
  //注意这块儿是从2开始的，不是从0开始的
  for (var i = 2; i < code_min.length; i++) {
    if (i % 2 === 0) {
      latArray_min.push(code_min[i]);
      latArray_max.push(code_max[i]);
    } else if (i % 2 === 1) {
      lonArray_min.push(code_min[i]);
      lonArray_max.push(code_max[i]);
    }
  }
  let latString_min = latArray_min.join("");
  let latString_max = latArray_max.join("");
  let lonString_min = lonArray_min.join("");
  let lonString_max = lonArray_max.join("");
  let latInt_min = parseInt(latString_min, 2);
  let lonInt_min = parseInt(lonString_min, 2);
  let latInt_max = parseInt(latString_max, 2);
  let lonInt_max = parseInt(lonString_max, 2);

  //这块的转化，把负的编码（首位为0）的值减了1，是为了避免类似100 和 000在去掉首位后都一样的情况（那样的话实际上在绘制的时候就少绘制了一个）
  //后边再把数字转编码的时候记得加回来。

  latInt_min = code_min[0] == "0" ? latInt_min : -latInt_min - 1;
  lonInt_min = code_min[1] == "0" ? lonInt_min : -lonInt_min - 1;
  latInt_max = code_max[0] == "0" ? latInt_max : -latInt_max - 1;
  lonInt_max = code_max[1] == "0" ? lonInt_max : -lonInt_max - 1;

  var latlist = Array();
  var lonlist = Array();

  for (var latInt = latInt_min; latInt <= latInt_max; latInt += 1) {
    let lonString, latString;
    if (latInt >= 0) {
      latString = latInt.toString(2);
      latString = Array(level - latString.length).join("0") + latString;
    } else {
      latString = Math.abs(latInt + 1).toString(2);
      latString = Array(level - latString.length).join("0") + latString;
    }
    if (lonInt >= 0) {
      lonString = lonInt.toString(2);
      lonString = Array(level - lonString.length).join("0") + lonString;
    } else {
      lonString = Math.abs(lonInt + 1).toString(2);
      lonString = Array(level - lonString.length).join("0") + lonString;
    }
    let code = "";
    if (latInt >= 0) {
      code = code.concat("0");
    } else {
      code = code.concat("1");
    }
    if (lonInt >= 0) {
      code = code.concat("0");
    } else {
      code = code.concat("1");
    }
    for (i = 0; i < level - 1; i++) {
      //用level-1而不用level，因为三个字符串的实际上第一位都是用于存正负的，之前加过了。
      code = code.concat(latString[i]);
      code = code.concat(lonString[i]);
    }
    let codeRange = decode_geosot_2d(code);
    latlist.push(codeRange.min_coord[0]);
  }
  latlist.push(decode_geosot_2d(code_max).max_coord[0]);

  for (var lonInt = lonInt_min; lonInt <= lonInt_max; lonInt += 1) {
    let lonString, latString;
    if (latInt >= 0) {
      latString = latInt.toString(2);
      latString = Array(level - latString.length).join("0") + latString;
    } else {
      latString = Math.abs(latInt + 1).toString(2);
      latString = Array(level - latString.length).join("0") + latString;
    }
    if (lonInt >= 0) {
      lonString = lonInt.toString(2);
      lonString = Array(level - lonString.length).join("0") + lonString;
    } else {
      lonString = Math.abs(lonInt + 1).toString(2);
      lonString = Array(level - lonString.length).join("0") + lonString;
    }
    let code = "";
    if (latInt >= 0) {
      code = code.concat("0");
    } else {
      code = code.concat("1");
    }
    if (lonInt >= 0) {
      code = code.concat("0");
    } else {
      code = code.concat("1");
    }
    for (i = 0; i < level - 1; i++) {
      //用level-1而不用level，因为三个字符串的实际上第一位都是用于存正负的，之前加过了。
      code = code.concat(latString[i]);
      code = code.concat(lonString[i]);
    }
    let codeRange = decode_geosot_2d(code);
    lonlist.push(codeRange.min_coord[1]);
  }
  lonlist.push(decode_geosot_2d(code_max).max_coord[1]);

  var distanceDisplayCondition = new Cesium.DistanceDisplayCondition(near, far);
  lonlist.forEach(function (item, index) {
    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          item,
          latlist[0],
          item,
          latlist[latlist.length - 1]
        ]),
        width: 1,
        material: material,
        distanceDisplayCondition: distanceDisplayCondition
      }
    });
  });

  latlist.forEach(function (item, index) {
    //分成25份，因为如果不分的话，在经度跨度较大的时候，会发生形变（弧线默认是按照球面圆弧走的，而我们希望沿着纬线走）
    for (let i = 0; i < 36; i++) {
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            (lonlist[0] * (36 - i)) / 36 + (lonlist[lonlist.length - 1] * i) / 36,
            item,
            (lonlist[0] * (36 - 1 - i)) / 36 + (lonlist[lonlist.length - 1] * (i + 1)) / 36,
            item
          ]),
          width: 1,
          material: material,
          distanceDisplayCondition: distanceDisplayCondition
        }
      });
    }
  });
}

//利用primitive的方式画网格
function draw_primitive_codes(
  viewer,
  level,
  lat_range,
  lon_range,
  height_range,
  primitives,
  material = Cesium.Color.RED.withAlpha(0.2)
) {
  let lonlatResolution = LON_LAT_TABLE[level];
  let heightResolution = HEIGHT_TABLE[level];
  let lat_min = lat_range ? lat_range[0] : -90;
  let lat_max = lat_range ? lat_range[1] : 90;
  let lon_min = lon_range ? lon_range[0] : -180;
  let lon_max = lon_range ? lon_range[1] : 180;
  let height_min = height_range ? height_range[0] : 0;
  let height_max = height_range ? height_range[1] : Math.pow(2, 27);

  let d_increase = 0.0000001; //微微增加一个小量
  let code_min = encode_geosot_3d(
    level,
    lat_min + d_increase,
    lon_min + d_increase,
    height_min + d_increase
  );
  let code_max = encode_geosot_3d(
    level,
    lat_max - d_increase,
    lon_max - d_increase,
    height_max - d_increase
  );

  let latArray_min = Array();
  let lonArray_min = Array();
  let heightArray_min = Array();
  let latArray_max = Array();
  let lonArray_max = Array();
  let heightArray_max = Array();
  //注意这块儿是从3开始的，不是从0开始的
  for (var i = 3; i < code_min.length; i++) {
    if (i % 3 === 0) {
      latArray_min.push(code_min[i]);
      latArray_max.push(code_max[i]);
    } else if (i % 3 === 1) {
      lonArray_min.push(code_min[i]);
      lonArray_max.push(code_max[i]);
    } else {
      heightArray_min.push(code_min[i]);
      heightArray_max.push(code_max[i]);
    }
  }
  let latString_min = latArray_min.join("");
  let latString_max = latArray_max.join("");
  let lonString_min = lonArray_min.join("");
  let lonString_max = lonArray_max.join("");
  let heightString_min = heightArray_min.join("");
  let heightString_max = heightArray_max.join("");
  let latInt_min = parseInt(latString_min, 2);
  let lonInt_min = parseInt(lonString_min, 2);
  let heightInt_min = parseInt(heightString_min, 2);
  let latInt_max = parseInt(latString_max, 2);
  let lonInt_max = parseInt(lonString_max, 2);
  let heightInt_max = parseInt(heightString_max, 2);

  //这块的转化，把负的编码（首位为0）的值减了1，是为了避免类似100 和 000在去掉首位后都一样的情况（那样的话实际上在绘制的时候就少绘制了一个）
  //后边再把数字转编码的时候记得加回来。
  latInt_min = code_min[0] == "0" ? latInt_min : -latInt_min - 1;
  lonInt_min = code_min[1] == "0" ? lonInt_min : -lonInt_min - 1;
  heightInt_min = code_min[2] == "0" ? heightInt_min : -heightInt_min - 1;
  latInt_max = code_max[0] == "0" ? latInt_max : -latInt_max - 1;
  lonInt_max = code_max[1] == "0" ? lonInt_max : -lonInt_max - 1;
  heightInt_max = code_max[2] == "0" ? heightInt_max : -heightInt_max - 1;

  var instances = [];
  var instances_outline = [];
  for (var lonInt = lonInt_min; lonInt <= lonInt_max; lonInt += 1) {
    for (var latInt = latInt_min; latInt <= latInt_max; latInt += 1) {
      for (var heightInt = heightInt_min; heightInt <= heightInt_max; heightInt += 1) {
        let latString, lonString, heightString;
        if (latInt >= 0) {
          latString = latInt.toString(2);
          latString = Array(level - latString.length).join("0") + latString;
        } else {
          latString = Math.abs(latInt + 1).toString(2);
          latString = Array(level - latString.length).join("0") + latString;
        }
        if (lonInt >= 0) {
          lonString = lonInt.toString(2);
          lonString = Array(level - lonString.length).join("0") + lonString;
        } else {
          lonString = Math.abs(lonInt + 1).toString(2);
          lonString = Array(level - lonString.length).join("0") + lonString;
        }
        if (heightInt >= 0) {
          heightString = heightInt.toString(2);
          heightString = Array(level - heightString.length).join("0") + heightString;
        } else {
          heightString = Math.abs(heightInt + 1).toString(2);
          heightString = Array(level - heightString.length).join("0") + heightString;
        }
        let code = "";
        if (latInt >= 0) {
          code = code.concat("0");
        } else {
          code = code.concat("1");
        }
        if (lonInt >= 0) {
          code = code.concat("0");
        } else {
          code = code.concat("1");
        }
        if (heightInt >= 0) {
          code = code.concat("0");
        } else {
          code = code.concat("1");
        }
        for (i = 0; i < level - 1; i++) {
          //用level-1而不用level，因为三个字符串的实际上第一位都是用于存正负的，之前加过了。
          code = code.concat(latString[i]);
          code = code.concat(lonString[i]);
          code = code.concat(heightString[i]);
        }
        draw_primitive_code(viewer, code, instances, instances_outline, material);
      }
    }
  }
  primitives.add(
    new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PerInstanceColorAppearance()
    })
  );
  primitives.add(
    new Cesium.Primitive({
      geometryInstances: instances_outline,
      appearance: new Cesium.PerInstanceColorAppearance()
    })
  );
}

function get_children_codes(code) {
  return [
    code + "000",
    code + "001",
    code + "010",
    code + "011",
    code + "100",
    code + "101",
    code + "110",
    code + "111"
  ];
}

//把3D编码转为2D编码
function transfer_3d_2d(code) {
  var code_2d = "";
  for (let i = 0; i < code.length; i += 3) {
    code_2d += code.slice(i, i + 2);
  }
  return code_2d;
}

//3D编码聚合
//iter_level是保证总共的递归次数
//简单地测试了几个例子，没问题。但是曾经有一次在数量很多的时候出过问题   /2018/10/14
function aggregate_codes_3d(codes, iter_level = 5) {
  if (iter_level == 0) {
    return codes;
  }
  codes = codes.sort(); //先排序一下
  let new_codes = [];
  for (let i = 0; i < codes.length; i++) {
    let j = 0;
    let storage_codes = [];
    while (j < 8 && i < codes.length) {
      let tempcode = codes[i];
      if (parseInt(codes[i].slice(-3), 2) != j) {
        //
        new_codes.push(codes[i]);
        new_codes = new_codes.concat(storage_codes);
        break;
      } else {
        storage_codes.push(codes[i]);
        i++;
        j++;
      }
    }
    if (j == 8) {
      i = i - 1;
      new_codes.push(codes[i].slice(0, -3));
    } else {
      //把storage里可能还存着的没aggregate完的编码放进去
      new_codes = new_codes.concat(storage_codes);
    }
  }
  if (new_codes.length < 8 || new_codes.length == codes.length) {
    return new_codes;
  } else {
    return aggregate_codes_3d(new_codes, iter_level - 1);
  }
}

//2D编码聚合
//iter_level是保证总共的递归次数
//简单地测试了几个例子，没有问题，但这个是按照3D聚合来得到的，3D聚合曾经出过问题。/2018/10/14
//iter_level=0是不进行聚合，iter_level=1是进行一次聚合（返回的集合中有两个层级的编码），iter_level=2是进行2次聚合（返回的集合中有两个层级的编码）……
function aggregate_codes_2d(codes, iter_level = 5) {
  if (iter_level == 0) {
    return codes;
  }
  codes = codes.sort(); //先排序一下
  console.log(codes);
  let new_codes = [];
  for (let i = 0; i < codes.length; i++) {
    let j = 0;
    let storage_codes = [];

    while (j < 4 && i < codes.length) {
      //tempcode = codes[i];
      if (parseInt(codes[i].slice(-2), 2) != j) {
        //
        new_codes.push(codes[i]);
        new_codes = new_codes.concat(storage_codes);
        break;
      } else {
        storage_codes.push(codes[i]);
        i++;
        j++;
      }
    }
    if (j == 4) {
      i = i - 1;
      new_codes.push(codes[i].slice(0, -2));
    }
    // else{//把storage里可能还存着的没aggregate完的编码放进去
    // 	new_codes = new_codes.concat(storage_codes);
    // }
  }
  if (new_codes.length < 4 || new_codes.length == codes.length) {
    return new_codes;
  } else {
    return aggregate_codes_2d(new_codes, iter_level - 1);
  }
}
//用entity的加载方式来实现LocalLOD
function local_lod(
  viewer,
  handler,
  [lat_min3, lat_max3],
  [lon_min3, lon_max3],
  [height_min, height_max],
  material = Cesium.Color.RED.withAlpha(0.2),
  code_collection = null,
  parents_grids = null
) {
  let lat_min = -90;
  let lat_max = 90;
  let lon_min = -180;
  let lon_max = 180;
  var field_view = viewer.camera.computeViewRectangle();
  let lat_min2 = Cesium.Math.toDegrees(field_view.south);
  let lat_max2 = Cesium.Math.toDegrees(field_view.north);
  let lon_min2 = Cesium.Math.toDegrees(field_view.west);
  let lon_max2 = Cesium.Math.toDegrees(field_view.east);
  var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
  var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
  var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
  var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
  let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
  var level = compute_level(temp);
  draw_codes(
    viewer,
    level,
    [lat_min3, lat_max3],
    [lon_min3, lon_max3],
    [height_min, height_max],
    material,
    code_collection,
    parents_grids
  );

  handler.setInputAction(function (movement) {
    for (let i = 0; i < code_collection.values.length; i++) {
      viewer.entities.remove(code_collection.values[i]);
    }
    code_collection.removeAll();
    //local_grids_array.length=0;
    var field_view = viewer.camera.computeViewRectangle();
    let lat_min2 = Cesium.Math.toDegrees(field_view.south);
    let lat_max2 = Cesium.Math.toDegrees(field_view.north);
    let lon_min2 = Cesium.Math.toDegrees(field_view.west);
    let lon_max2 = Cesium.Math.toDegrees(field_view.east);
    var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
    var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
    var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
    var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
    let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
    var level = compute_level(temp);
    draw_codes(
      viewer,
      level,
      [lat_min3, lat_max3],
      [lon_min3, lon_max3],
      [height_min, height_max],
      material,
      code_collection,
      parents_grids
    );
  }, Cesium.ScreenSpaceEventType.LEFT_UP);
  handler.setInputAction(function (wheelment) {
    for (let i = 0; i < code_collection.values.length; i++) {
      viewer.entities.remove(code_collection.values[i]);
    }
    code_collection.removeAll();
    var field_view = viewer.camera.computeViewRectangle();
    let lat_min2 = Cesium.Math.toDegrees(field_view.south);
    let lat_max2 = Cesium.Math.toDegrees(field_view.north);
    let lon_min2 = Cesium.Math.toDegrees(field_view.west);
    let lon_max2 = Cesium.Math.toDegrees(field_view.east);
    var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
    var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
    var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
    var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
    let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
    var level = compute_level(temp);
    draw_codes(
      viewer,
      level,
      [lat_min3, lat_max3],
      [lon_min3, lon_max3],
      [height_min, height_max],
      material,
      code_collection,
      parents_grids
    );
  }, Cesium.ScreenSpaceEventType.WHEEL);
}

//用primitives的加载方式来实现LocalLOD
function local_lod_primitives(
  viewer,
  handler,
  [lat_min, lat_max],
  [lon_min, lon_max],
  [height_min, height_max],
  primitives,
  material = Cesium.Color.RED.withAlpha(0.2)
) {
  var field_view = viewer.camera.computeViewRectangle();
  let lat_min2 = Cesium.Math.toDegrees(field_view.south);
  let lat_max2 = Cesium.Math.toDegrees(field_view.north);
  let lon_min2 = Cesium.Math.toDegrees(field_view.west);
  let lon_max2 = Cesium.Math.toDegrees(field_view.east);
  var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
  var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
  var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
  var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
  let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
  var level = compute_level(temp);
  draw_primitive_codes(
    viewer,
    level,
    [lat_min3, lat_max3],
    [lon_min3, lon_max3],
    [height_min, height_max],
    primitives,
    material
  );

  handler.setInputAction(function (movement) {
    //primitives.removeAll();
    var field_view = viewer.camera.computeViewRectangle();
    let lat_min2 = Cesium.Math.toDegrees(field_view.south);
    let lat_max2 = Cesium.Math.toDegrees(field_view.north);
    let lon_min2 = Cesium.Math.toDegrees(field_view.west);
    let lon_max2 = Cesium.Math.toDegrees(field_view.east);
    var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
    var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
    var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
    var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
    let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
    var level = compute_level(temp);
    draw_primitive_codes(
      viewer,
      level,
      [lat_min3, lat_max3],
      [lon_min3, lon_max3],
      [height_min, height_max],
      primitives,
      material
    );
    sleep(4000).then(() => {
      if (primitives.length > 2) {
        primitives.remove(primitives.get(0));
        primitives.remove(primitives.get(0));
      }
    });
  }, Cesium.ScreenSpaceEventType.LEFT_UP);
  handler.setInputAction(function (wheelment) {
    //primitives.removeAll();
    var field_view = viewer.camera.computeViewRectangle();
    let lat_min2 = Cesium.Math.toDegrees(field_view.south);
    let lat_max2 = Cesium.Math.toDegrees(field_view.north);
    let lon_min2 = Cesium.Math.toDegrees(field_view.west);
    let lon_max2 = Cesium.Math.toDegrees(field_view.east);
    var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
    var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
    var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
    var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
    let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
    var level = compute_level(temp);
    //var tempprimitives = new Cesium.PrimitiveCollection();
    //viewer.scene.primitives.add(tempprimitives);
    draw_primitive_codes(
      viewer,
      level,
      [lat_min3, lat_max3],
      [lon_min3, lon_max3],
      [height_min, height_max],
      primitives,
      material
    );
    //primitives.removeAll();
    //primitives = tempprimitives;
    ////tempprimitives.destroy();
    sleep(4000).then(() => {
      if (primitives.length > 2) {
        primitives.remove(primitives.get(0));
        primitives.remove(primitives.get(0));
      }
    });
  }, Cesium.ScreenSpaceEventType.WHEEL);
}

//用entity的加载方式来实现globalLOD
function global_lod(
  viewer,
  handler,
  [height_min, height_max],
  material = Cesium.Color.RED.withAlpha(0.2),
  code_collection = null,
  parents_grids = null
) {
  let lat_min = -90;
  let lat_max = 90;
  let lon_min = -180;
  let lon_max = 180;
  var field_view = viewer.camera.computeViewRectangle();
  let lat_min2 = Cesium.Math.toDegrees(field_view.south);
  let lat_max2 = Cesium.Math.toDegrees(field_view.north);
  let lon_min2 = Cesium.Math.toDegrees(field_view.west);
  let lon_max2 = Cesium.Math.toDegrees(field_view.east);
  var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
  var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
  var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
  var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
  let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
  var level = compute_level(temp);
  draw_codes(
    viewer,
    level,
    [lat_min3, lat_max3],
    [lon_min3, lon_max3],
    [height_min, height_max],
    material,
    code_collection,
    parents_grids
  );
  handler.setInputAction(function (movement) {
    for (let i = 0; i < code_collection.values.length; i++) {
      viewer.entities.remove(code_collection.values[i]);
    }
    code_collection.removeAll();
    var field_view = viewer.camera.computeViewRectangle();
    let lat_min2 = Cesium.Math.toDegrees(field_view.south);
    let lat_max2 = Cesium.Math.toDegrees(field_view.north);
    let lon_min2 = Cesium.Math.toDegrees(field_view.west);
    let lon_max2 = Cesium.Math.toDegrees(field_view.east);
    var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
    var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
    var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
    var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
    let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
    var level = compute_level(temp);
    draw_codes(
      viewer,
      level,
      [lat_min3, lat_max3],
      [lon_min3, lon_max3],
      [height_min, height_max],
      material,
      code_collection,
      parents_grids
    );
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  handler.setInputAction(function (wheelment) {
    for (let i = 0; i < code_collection.values.length; i++) {
      viewer.entities.remove(code_collection.values[i]);
    }
    code_collection.removeAll();
    var field_view = viewer.camera.computeViewRectangle();
    let lat_min2 = Cesium.Math.toDegrees(field_view.south);
    let lat_max2 = Cesium.Math.toDegrees(field_view.north);
    let lon_min2 = Cesium.Math.toDegrees(field_view.west);
    let lon_max2 = Cesium.Math.toDegrees(field_view.east);
    var lat_min3 = lat_min2 < lat_min ? lat_min : lat_min2;
    var lat_max3 = lat_max2 > lat_max ? lat_max : lat_max2;
    var lon_min3 = lon_min2 < lon_min ? lon_min : lon_min2;
    var lon_max3 = lon_max2 > lon_max ? lon_max : lon_max2;
    let temp = Math.max(lon_max3 - lon_min3, lat_max3 - lat_min3);
    var level = compute_level(temp);
    draw_codes(
      viewer,
      level,
      [lat_min3, lat_max3],
      [lon_min3, lon_max3],
      [height_min, height_max],
      material,
      code_collection,
      parents_grids
    );
  }, Cesium.ScreenSpaceEventType.WHEEL);
}

function local_lod_2d_line(viewer) {
  let lon_min = 30;
  let lon_max = 140;
  let lat_min = 0o0;
  let lat_max = 70;
  //draw_codes_2d_line(viewer, 10, [lon_min, lon_max], [lat_min, lat_max], style=0.1, near = 5000000, far = Number.MAX_VALUE);
  //draw_codes_2d_line(viewer, 11, [lon_min, lon_max], [lat_min, lat_max], style=0, near = 300000, far = 500000);
  //draw_codes_2d_line(viewer, 12, [lon_min, lon_max], [lat_min, lat_max], style=0.5, near = 1000000, far = 5000000);
  //draw_codes_2d_line(viewer, 13, [lon_min, lon_max], [lat_min, lat_max], style=0.7, near = 500000, far = 1000000);
  draw_codes_2d_line(
    viewer,
    15,
    [lon_min, lon_max],
    [lat_min, lat_max],
    (style = 0.99),
    (near = 0),
    (far = 500000)
  );
  //draw_codes_2d_line(viewer, 13, [lon_min, lon_max], [lat_min, lat_max], style=0, near = 50000, far = 100000);
  //draw_codes_2d_line(viewer, 14, [lon_min, lon_max], [lat_min, lat_max], style=0, near = 30000, far = 100000);
  //draw_codes_2d_line(viewer, 15, [lon_min, lon_max], [lat_min, lat_max], style=0, near = 0, far = 30000);
  //draw_codes_2d_line(viewer, 16, [lon_min, lon_max], [lat_min, lat_max], style=0, near = 5000, far = 10000);
  //draw_codes_2d_line(viewer, 17, [lon_min, lon_max], [lat_min, lat_max], style=0, near = 3000, far = 5000);
  //draw_codes_2d_line(viewer, 18, [lon_min, lon_max], [lat_min, lat_max], style=0, near = 1000, far = 3000);
}
function global_lod_2d_line(viewer) {}

/**
 * 绘制长方体外包编码对应的网格
 * @param code
 * @param material
 */
function draw_surrounded_obb_primitive(code, viewer, material = Cesium.Color.GREY.withAlpha(0.1)) {
  let codeRange = decode_geosot_3d(code);

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 90 ||
    codeRange.max_coord[0] <= -90 ||
    codeRange.min_coord[1] >= 180 ||
    codeRange.max_coord[1] <= -180
  )
    return;

  let lat_min = codeRange.min_coord[0];
  let lon_min = codeRange.min_coord[1];
  let lat_max = codeRange.max_coord[0];
  let lon_max = codeRange.max_coord[1];

  if (!material) {
    material = Cesium.Color.fromRandom({
      minimumRed: 0.1,
      minimumGreen: 0.1,
      minimumBlue: 0.1,
      maximumRed: 0.5,
      maximumGreen: 0.5,
      maximumBlue: 0.8,
      alpha: 0.2
    });
  }
  var temp = new Cesium.Entity({
    name: code,
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max),
      material: Cesium.Color.GREY.withAlpha(0.1),
      extrudedHeight: codeRange.max_coord[2],
      height: codeRange.min_coord[2],
      outline: true,
      outlineColor: Cesium.Color.GREENYELLOW
    }
  });

  viewer.entities.add(temp);
}

/**
 * 绘制三维网格
 */
function draw_redao_3d_primitive(code, viewer, material = Cesium.Color.RED.withAlpha(0.2)) {
  let codeRange = decode_geosot_3d(code);

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 90 ||
    codeRange.max_coord[0] <= -90 ||
    codeRange.min_coord[1] >= 180 ||
    codeRange.max_coord[1] <= -180
  )
    return;

  let lat_min = codeRange.min_coord[0];
  let lon_min = codeRange.min_coord[1];
  let lat_max = codeRange.max_coord[0];
  let lon_max = codeRange.max_coord[1];

  if (!material) {
    material = Cesium.Color.fromRandom({
      minimumRed: 0.1,
      minimumGreen: 0.1,
      minimumBlue: 0.1,
      maximumRed: 0.5,
      maximumGreen: 0.5,
      maximumBlue: 0.8,
      alpha: 0.2
    });
  }

  let demoOutlinColor = undefined;
  if (codeRange.max_coord[2] < 1000) {
    demoOutlinColor = Cesium.Color.RED;
  } else if (codeRange.max_coord[2] < 2000) {
    demoOutlinColor = Cesium.Color.YELLOW;
  } else if (codeRange.max_coord[2] < 3000) {
    demoOutlinColor = Cesium.Color.BLACK;
  } else {
    demoOutlinColor = Cesium.Color.PINK;
  }

  var temp = new Cesium.Entity({
    name: code,
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max),
      material: material,
      extrudedHeight: codeRange.max_coord[2],
      height: codeRange.min_coord[2],
      outline: true,
      outlineColor: demoOutlinColor
    }
  });
  viewer.entities.add(temp);
}

/**
 * 绘制单个primitive网格，需要关闭深度检测，否则显示不正确
 * @param code 二进制的二维网格编码
 */
function draw_redao_primitive(code, material = Cesium.Color.RED.withAlpha(1)) {
  let codeRange = decode_geosot_2d(code);

  // console.log("codeRange为==================")
  // console.log(codeRange)

  let level = codeRange.level;
  if (
    codeRange.min_coord[0] >= 90 ||
    codeRange.max_coord[0] <= -90 ||
    codeRange.min_coord[1] >= 180 ||
    codeRange.max_coord[1] <= -180
  )
    return;

  let lat_min = codeRange.min_coord[0];
  let lon_min = codeRange.min_coord[1];
  let lat_max = codeRange.max_coord[0];
  let lon_max = codeRange.max_coord[1];

  // viewer.scene.primitives.add(new Cesium.Primitive({
  // 	geometryInstances: new Cesium.GeometryInstance({
  // 		geometry: new Cesium.RectangleGeometry({
  // 			rectangle: Cesium.Rectangle.fromDegrees(lon_min, lat_min, lon_max, lat_max),
  // 		}),
  // 		attributes: {
  // 			color: Cesium.ColorGeometryInstanceAttribute.fromColor(material)
  // 		}
  // 	}),
  // 	appearance: new Cesium.PerInstanceColorAppearance({
  // 		flat: true,
  // 		translucent: false,
  // 		renderState: {
  // 			lineWidth: Math.min(4.0, scene.maximumAliasedLineWidth)
  // 		}})
  // }))

  // 网格边框线
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: Cesium.PolygonOutlineGeometry.createGeometry(
          Cesium.PolygonOutlineGeometry.fromPositions({
            positions: Cesium.Cartesian3.fromDegreesArray([
              lon_min,
              lat_min,
              lon_min,
              lat_max,
              lon_max,
              lat_max,
              lon_max,
              lat_min
            ])
          })
        ),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREEN)
        }
      }),
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: false,
        renderState: {
          lineWidth: Math.min(4.0, scene.maximumAliasedLineWidth)
        }
      })
    })
  );
}

export { encode_geosot_3d, decode_geosot_3d, draw_surrounded_obb_primitive };
