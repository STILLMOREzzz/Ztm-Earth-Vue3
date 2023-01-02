/**
 * @Author: STILLMOREzzz
 * @Date: 2023-01-02
 * @Description: 包围盒的绘制函数
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-01-02 13:54
 * @FilePath: ztm-earth-vue3/src/utils/geosot/boundingBox.js
 */

/**
 * 用来简单的测试
 */
function testFeature() {
  const myTileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: "http://localhost:9003/model/tbDlkaTC8/tileset.json"
    })
  ); // 返回的是3dtileset，类型是object
  console.log(myTileset);

  myTileset.featureMap = new Map();
  myTileset.tileLoad.addEventListener(function (tile) {
    let content = tile.content; // return Batched3DModel3DTileContent
    console.log(content);
    if (content && content.featuresLength > 0) {
      const demo = content.getFeature(2);
      console.log("Feature为", demo);
      const names = demo.getPropertyNames();
      for (let i = 0; i < names.length; ++i) {
        let propertyName = names[i];
        console.log(propertyName + ": " + demo.getProperty(propertyName));
      }

      // const featuresLength = content.featuresLength;
      // for (let i = 0; i < featuresLength; ++i) {
      //     const feature = content.getFeature(i); // return Cesium3DTileFeature
      //     console.log(feature)
      //     let name = SnUtil.getAlias(feature.getProperty('name'));
      //     if (!myTileset.featureMap.get(name)) {
      //         let featureEntity = new 3DTileFeatureEntity(feature);
      //         myTileset.featureMap.set(name, featureEntity);
      //     }
      // }
    }
  });
  myTileset.tileLoad._listeners.forEach((item) => {
    myTileset.tileLoad.removeEventListener(item);
  });
  myTileset.tileLoad.addEventListener(function (tile) {
    let content = tile.content; // return Batched3DModel3DTileContent
    console.log(content);
    if (content && content.featuresLength > 0) {
      const demo = content.getFeature(2);
      console.log("第二次为", demo);
    }
    console.log("+++++++++++++++++++++++++++++++++++++");
  });
  viewer.camera.flyTo({
    destination: Cesium.Rectangle.fromDegrees(114.3019661, 34.7838396, 114.3403658, 34.8103886)
  });
}

/**
 * 对应顶端 ‘绘制包围盒’ 按钮，实现对daYanTaTileset包围盒的绘制和geosot网格的绘制
 */
function drawDaYanTaOBB() {
  // 获取包围盒的顶点坐标
  let cornerPositions = this.addCornerPoint(daYanTaTileset);
  // 绘制包围盒的线框
  this.drawOBB(daYanTaTileset);

  // 计算获得包围盒的长宽高 0,4,6,7
  let long = Cesium.Cartesian3.distance(cornerPositions[0], cornerPositions[7]);
  let width = Cesium.Cartesian3.distance(cornerPositions[0], cornerPositions[4]);
  let height = Cesium.Cartesian3.distance(cornerPositions[0], cornerPositions[6]);

  // 求得长宽高的最大值
  // todo:写一个函数，根据长宽高的最大值从而计算得到一个合适的网格层级
  let middle = long > width ? long : width;
  let max = middle > height ? middle : height;
  console.log("max为：", max);

  let center = daYanTaTileset._root._boundingVolume._orientedBoundingBox.center;
  cornerPositions.push(center);
  // 获取包围盒角点的经纬度坐标
  let cartographicPositions = this.cartesianToLatitudeLongitude(cornerPositions);

  /*
  // 获取三维物体对应的长方体外包编码（16进制）和层级
  let { geo_level_list, geo_num_list } = this.getOBBGeoSOTCode(cartographicPositions, height)
  */

  // todo:二进制网格码与16进制网格码的相互转换

  let codeArray = [];
  for (let i = 0; i < cartographicPositions.length; i++) {
    // 19级有点小，18级太大
    codeArray.push(
      encode_geosot_3d(
        18,
        cartographicPositions[i][0],
        cartographicPositions[i][1],
        cartographicPositions[i][2]
      )
    );
  }

  // 去重后对网格进行绘制
  codeArray = codeArray.removeDuplicates();
  for (let i = 0; i < codeArray.length; i++) {
    draw_surrounded_obb_primitive(codeArray[i]);
  }

  // 获取顶点对应的26领域范围并绘制
  // let centerPpoint3D = getDomainMeshDualMadeCoding(cartographicPositions);
  // for(let i = 0;i<centerPpoint3D.length;i++){
  //     draw_surrounded_obb_primitive(centerPpoint3D[i])
  // };
}

/**
 * 得到相邻六邻域网格的二进制编码
 * @param cartographicPositions 经纬度坐标数组数据
 * @param level 网格等级
 * @return 相邻六邻域网格的二进制编码
 */
function getDomainMeshDualMadeCoding(cartographicPositions, level = 19) {
  // 通过点的经纬度坐标然后进行本地编码获取3d网格码，然后对3d网格码进行本地解码，获得相应层级网格的范围，
  // 然后通过网格范围计算中心点坐标，通过坐标和接口获得16进制相应的网格编码，
  // 然后再次通过接口获取网格编码对应的范围，之后再次计算中心点，
  // 根据中心点在本地获取二进制编码，最后进行网格绘制

  // 获取传入点所在网格的中心点坐标
  let codeArray = [];
  for (let i = 0; i < cartographicPositions.length; i++) {
    // 19级有点小，18级太大
    let data = decode_geosot_3d(
      encode_geosot_3d(
        level,
        cartographicPositions[i][0],
        cartographicPositions[i][1],
        cartographicPositions[i][2]
      )
    );
    let coord = [];
    coord[0] = (data.min_coord[0] + data.max_coord[0]) / 2; // lat
    coord[1] = (data.min_coord[1] + data.max_coord[1]) / 2; // lon
    coord[2] = (data.min_coord[2] + data.max_coord[2]) / 2; // height
    codeArray.push(coord);
  }

  // 得到中心点坐标的6邻域并去重
  let hexEncoding = [];
  for (let i = 0; i < codeArray.length; i++) {
    // todo：把jquery的形式修改为axios，下同 --2023.01.02
    $.ajax({
      url: "https://www.iwhere.com/iwhereEngine/geosot3d/point3d",
      async: false,
      data: `lat=${codeArray[i][0]}&lng=${codeArray[i][1]}&height=${codeArray[i][2]}&geo_level=${level}`,
      success: function (data) {
        $.ajax({
          url: "https://www.iwhere.com/iwhereEngine/geosot3d/adjoin6_geo_num",
          async: false,
          data: `geo_num=${data.geo_num}&geo_level=${level}`,
          success: function (data2) {
            hexEncoding.push(data2.geo_num_list);
          },
          error: function (dataCode) {
            console.log("失败" + dataCode);
          },
          type: "POST"
        });
      },
      error: function (dataCode) {
        console.log("失败" + dataCode);
      },
      type: "POST"
    });
  }
  let hexadecimalEncodedArray = [];
  for (let i = 0; i < hexEncoding.length; i++) {
    hexadecimalEncodedArray = [...hexadecimalEncodedArray, ...hexEncoding[i]];
  }
  hexadecimalEncodedArray = hexadecimalEncodedArray.removeDuplicates(); // 16进制网格编码
  let centerPpoint3D = [];
  for (let i = 0; i < hexadecimalEncodedArray.length; i++) {
    $.ajax({
      url: "https://www.iwhere.com/iwhereEngine/geosot3d/center_point3d",
      async: false,
      data: `geo_num=${hexadecimalEncodedArray[i]}&geo_level=${level}`,
      success: function (data3) {
        centerPpoint3D.push(encode_geosot_3d(level, data3.lat, data3.lng, data3.height));
      },
      error: function (dataCode) {
        console.log("失败" + dataCode);
      },
      type: "POST"
    });
  }
  return centerPpoint3D;
}
/**
 * 根据传入的经纬度坐标，通过ajax发送请求获取长方体外包编码体集合
 * @param cartographicPositions 经纬度坐标数组
 * @param height 外包长方体高度
 * @return 请求到的网格相关属性（编码为16进制）
 */
function getOBBGeoSOTCode(cartographicPositions, height) {
  // let height = Cesium.Cartesian3.distance(cornerPositions[0],cornerPositions[6]);
  let geo_level = 19;
  let responsedata;
  $.ajax({
    url: "https://www.iwhere.com/iwhereEngine/geosot3d/rcuboid_buffer",
    async: false,
    data: `lat_left_top=${cartographicPositions[5][0]}&lng_left_top=${cartographicPositions[5][1]}&lat_right_bottom=${cartographicPositions[4][0]}&lng_right_bottom=${cartographicPositions[4][1]}&height_start=${cartographicPositions[4][2]}&height=${height}&geo_level=${geo_level}`,
    success: function (data) {
      console.log(data);
      responsedata = data;
    },
    error: function (dataCode) {
      console.log("失败" + dataCode);
    },
    type: "POST"
  });
  return responsedata;
}

/**
 * 笛卡尔3d坐标转经纬度
 * @param cornerPositions 笛卡尔坐标，要求为一个数组
 * @return 一个经纬度坐标数组
 */
function cartesianToLatitudeLongitude(cornerPositions) {
  let cartographicPositions = new Array();
  for (let i = 0; i < cornerPositions.length; i++) {
    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cornerPositions[i]);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let hig = cartographic.height;
    let positions = [lat, lng, hig];
    cartographicPositions.push(positions);
  }
  return cartographicPositions;
}

/**
 * 绘制tileset的包围盒线框
 * @param: tileset viewer.scene.primitives.add()操作成功之后的tileset
 */
function drawOBB(tileset) {
  // 获取整体3dtileset的包围盒属性 daYanTaTileset._root._boundingVolume
  let a = tileset._root._boundingVolume._orientedBoundingBox.halfAxes;
  let center = tileset._root._boundingVolume._orientedBoundingBox.center;

  // 添加一个Tileset的OrientedBoundingBox(包围盒)
  obb = new Cesium.OrientedBoundingBox(center, a);
  var bs = Cesium.BoundingSphere.fromOrientedBoundingBox(obb);

  // Cesium.GeometryPipeline.toWireframe 将几何的三角形索引转换为线索引
  geometry = Cesium.GeometryPipeline.toWireframe(
    Cesium.BoxGeometry.createGeometry(
      Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(2.0, 2.0, 2.0),
        vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT
      })
    )
  );

  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: geometry,
        modelMatrix: Cesium.Matrix4.fromRotationTranslation(
          obb.halfAxes,
          obb.center,
          new Cesium.Matrix4()
        ),
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 1.0, 1.0)
        }
      }),
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: false
      }),
      asynchronous: false
    })
  );

  // 将tileset使用红色的线框包围球显示
  // var radius = bs.radius;
  // var geometry = Cesium.GeometryPipeline.toWireframe(Cesium.EllipsoidGeometry.createGeometry(new Cesium.EllipsoidGeometry({
  //     radii : new Cesium.Cartesian3(radius, radius, radius),
  //     vertexFormat : Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT
  // })));
  // viewer.scene.primitives.add(new Cesium.Primitive({
  //     geometryInstances : new Cesium.GeometryInstance({
  //         geometry : geometry,
  //         modelMatrix : Cesium.Matrix4.fromTranslation(bs.center),
  //         attributes : {
  //             color : new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 1.0)
  //         }
  //     }),
  //     appearance : new Cesium.PerInstanceColorAppearance({
  //         flat : true,
  //         translucent : false
  //     }),
  //     asynchronous : false
  // }));
}
/**
 * 对传入的tileset包围盒顶点进行不同颜色的顶点显示
 * @param tileset  viewer.scene.primitives.add()操作成功之后的tileset
 * @return 各个角点的坐标 Cartesian3
 */
function addCornerPoint(tileset) {
  let a = tileset._root._boundingVolume._orientedBoundingBox.halfAxes;
  let center = tileset._root._boundingVolume._orientedBoundingBox.center;

  // 给x,y,z 赋予矩阵列向量
  let x = new Cesium.Cartesian3();
  let y = new Cesium.Cartesian3();
  let z = new Cesium.Cartesian3();
  Cesium.Matrix3.getColumn(a, 0, x);
  Cesium.Matrix3.getColumn(a, 1, y);
  Cesium.Matrix3.getColumn(a, 2, z);

  // -x-y-z
  let temp1 = new Cesium.Cartesian3();
  let temp2 = new Cesium.Cartesian3();
  let temp3 = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(center, x, temp1);
  Cesium.Cartesian3.subtract(temp1, y, temp2);
  Cesium.Cartesian3.subtract(temp2, z, temp3);
  // console.log('temp3为：',temp3);

  let originPoint2 = new Cesium.Entity({
    id: "ceshi2",
    position: temp3,
    point: {
      color: Cesium.Color.RED,
      pixelSize: 10
    }
  });

  let temp4 = new Cesium.Cartesian3();
  let temp5 = new Cesium.Cartesian3();
  let temp6 = new Cesium.Cartesian3();

  Cesium.Cartesian3.add(center, x, temp4);
  Cesium.Cartesian3.add(temp4, y, temp5);
  Cesium.Cartesian3.add(temp5, z, temp6);

  // console.log('temp6：',temp6);

  let originPoint3 = new Cesium.Entity({
    id: "ceshi3",
    position: temp6,
    point: {
      color: Cesium.Color.BLUE,
      pixelSize: 10
    }
  });

  let temp7 = new Cesium.Cartesian3();
  let temp8 = new Cesium.Cartesian3();
  let temp9 = new Cesium.Cartesian3();
  Cesium.Cartesian3.add(center, x, temp7);
  Cesium.Cartesian3.subtract(temp7, y, temp8);
  Cesium.Cartesian3.add(temp8, z, temp9);
  // console.log('temp9：',temp9);
  let originPoint4 = new Cesium.Entity({
    id: "ceshi4",
    position: temp9,
    point: {
      color: Cesium.Color.GRAY,
      pixelSize: 10
    }
  });

  let temp10 = new Cesium.Cartesian3();
  let temp11 = new Cesium.Cartesian3();
  let temp12 = new Cesium.Cartesian3();
  Cesium.Cartesian3.add(center, x, temp10);
  Cesium.Cartesian3.add(temp10, y, temp11);
  Cesium.Cartesian3.subtract(temp11, z, temp12);
  // console.log('temp12：',temp12);
  let originPoint5 = new Cesium.Entity({
    id: "ceshi5",
    position: temp12,
    point: {
      color: Cesium.Color.BLACK,
      pixelSize: 10
    }
  });

  let temp13 = new Cesium.Cartesian3();
  let temp14 = new Cesium.Cartesian3();
  let temp15 = new Cesium.Cartesian3();
  Cesium.Cartesian3.add(center, x, temp13);
  Cesium.Cartesian3.subtract(temp13, y, temp14);
  Cesium.Cartesian3.subtract(temp14, z, temp15);
  // console.log('temp15：',temp15);
  let originPoint6 = new Cesium.Entity({
    id: "ceshi6",
    position: temp15,
    point: {
      color: Cesium.Color.GREEN,
      pixelSize: 10
    }
  });

  let temp16 = new Cesium.Cartesian3();
  let temp17 = new Cesium.Cartesian3();
  let temp18 = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(center, x, temp16);
  Cesium.Cartesian3.add(temp16, y, temp17);
  Cesium.Cartesian3.add(temp17, z, temp18);
  // console.log('temp18：',temp18);
  let originPoint7 = new Cesium.Entity({
    id: "ceshi7",
    position: temp18,
    point: {
      color: Cesium.Color.YELLOW,
      pixelSize: 10
    }
  });

  let temp19 = new Cesium.Cartesian3();
  let temp20 = new Cesium.Cartesian3();
  let temp21 = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(center, x, temp19);
  Cesium.Cartesian3.subtract(temp19, y, temp20);
  Cesium.Cartesian3.add(temp20, z, temp21);
  // console.log('temp21：',temp21);
  let originPoint8 = new Cesium.Entity({
    id: "ceshi8",
    position: temp21,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 10
    }
  });

  let temp22 = new Cesium.Cartesian3();
  let temp23 = new Cesium.Cartesian3();
  let temp24 = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(center, x, temp22);
  Cesium.Cartesian3.add(temp22, y, temp23);
  Cesium.Cartesian3.subtract(temp23, z, temp24);
  // console.log('temp24：',temp24);
  let originPoint9 = new Cesium.Entity({
    id: "ceshi9",
    position: temp24,
    point: {
      color: Cesium.Color.PINK,
      pixelSize: 10
    }
  });

  // 添加各种颜色的顶点
  // for (let i = 2;i < 10;i++){
  //     let s = eval('originPoint' + i)
  //     viewer.entities.add(s);
  // };

  let cornerPostions = new Array();
  for (let i = 3; i < 25; i += 3) {
    let ss = "temp" + i;
    let s = eval(ss);
    cornerPostions.push(s);
  }
  return cornerPostions;
}
/**
 * 对传入的tile包围盒顶点进行不同颜色的顶点显示
 * @param tile  Cesium3DTile 对象
 * @return 各个角点的坐标和中心点坐标 Cartesian3
 */
function addTileCornerPoint(tile) {
  let a = tile.boundingVolume._orientedBoundingBox.halfAxes;
  let center = tile.boundingVolume._orientedBoundingBox.center;

  // 给x,y,z 赋予矩阵列向量
  let x = new Cesium.Cartesian3();
  let y = new Cesium.Cartesian3();
  let z = new Cesium.Cartesian3();
  Cesium.Matrix3.getColumn(a, 0, x);
  Cesium.Matrix3.getColumn(a, 1, y);
  Cesium.Matrix3.getColumn(a, 2, z);

  // -x-y-z
  let temp1 = new Cesium.Cartesian3();
  let temp2 = new Cesium.Cartesian3();
  let temp3 = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(center, x, temp1);
  Cesium.Cartesian3.subtract(temp1, y, temp2);
  Cesium.Cartesian3.subtract(temp2, z, temp3);
  // console.log('temp3为：',temp3);

  let originPoint2 = new Cesium.Entity({
    id: "ceshi2",
    position: temp3,
    point: {
      color: Cesium.Color.RED,
      pixelSize: 10
    }
  });

  let temp4 = new Cesium.Cartesian3();
  let temp5 = new Cesium.Cartesian3();
  let temp6 = new Cesium.Cartesian3();

  Cesium.Cartesian3.add(center, x, temp4);
  Cesium.Cartesian3.add(temp4, y, temp5);
  Cesium.Cartesian3.add(temp5, z, temp6);

  // console.log('temp6：',temp6);

  let originPoint3 = new Cesium.Entity({
    id: "ceshi3",
    position: temp6,
    point: {
      color: Cesium.Color.BLUE,
      pixelSize: 10
    }
  });

  let temp7 = new Cesium.Cartesian3();
  let temp8 = new Cesium.Cartesian3();
  let temp9 = new Cesium.Cartesian3();
  Cesium.Cartesian3.add(center, x, temp7);
  Cesium.Cartesian3.subtract(temp7, y, temp8);
  Cesium.Cartesian3.add(temp8, z, temp9);
  // console.log('temp9：',temp9);
  let originPoint4 = new Cesium.Entity({
    id: "ceshi4",
    position: temp9,
    point: {
      color: Cesium.Color.GRAY,
      pixelSize: 10
    }
  });

  let temp10 = new Cesium.Cartesian3();
  let temp11 = new Cesium.Cartesian3();
  let temp12 = new Cesium.Cartesian3();
  Cesium.Cartesian3.add(center, x, temp10);
  Cesium.Cartesian3.add(temp10, y, temp11);
  Cesium.Cartesian3.subtract(temp11, z, temp12);
  // console.log('temp12：',temp12);
  let originPoint5 = new Cesium.Entity({
    id: "ceshi5",
    position: temp12,
    point: {
      color: Cesium.Color.BLACK,
      pixelSize: 10
    }
  });

  let temp13 = new Cesium.Cartesian3();
  let temp14 = new Cesium.Cartesian3();
  let temp15 = new Cesium.Cartesian3();
  Cesium.Cartesian3.add(center, x, temp13);
  Cesium.Cartesian3.subtract(temp13, y, temp14);
  Cesium.Cartesian3.subtract(temp14, z, temp15);
  // console.log('temp15：',temp15);
  let originPoint6 = new Cesium.Entity({
    id: "ceshi6",
    position: temp15,
    point: {
      color: Cesium.Color.GREEN,
      pixelSize: 10
    }
  });

  let temp16 = new Cesium.Cartesian3();
  let temp17 = new Cesium.Cartesian3();
  let temp18 = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(center, x, temp16);
  Cesium.Cartesian3.add(temp16, y, temp17);
  Cesium.Cartesian3.add(temp17, z, temp18);
  // console.log('temp18：',temp18);
  let originPoint7 = new Cesium.Entity({
    id: "ceshi7",
    position: temp18,
    point: {
      color: Cesium.Color.YELLOW,
      pixelSize: 10
    }
  });

  let temp19 = new Cesium.Cartesian3();
  let temp20 = new Cesium.Cartesian3();
  let temp21 = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(center, x, temp19);
  Cesium.Cartesian3.subtract(temp19, y, temp20);
  Cesium.Cartesian3.add(temp20, z, temp21);
  // console.log('temp21：',temp21);
  let originPoint8 = new Cesium.Entity({
    id: "ceshi8",
    position: temp21,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 10
    }
  });

  let temp22 = new Cesium.Cartesian3();
  let temp23 = new Cesium.Cartesian3();
  let temp24 = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(center, x, temp22);
  Cesium.Cartesian3.add(temp22, y, temp23);
  Cesium.Cartesian3.subtract(temp23, z, temp24);
  // console.log('temp24：',temp24);
  let originPoint9 = new Cesium.Entity({
    id: "ceshi9",
    position: temp24,
    point: {
      color: Cesium.Color.PINK,
      pixelSize: 10
    }
  });

  // 添加各种颜色的顶点
  // for (let i = 2;i < 10;i++){
  //     let s = eval('originPoint' + i)
  //     viewer.entities.add(s);
  // };

  let cornerPostions = new Array();
  for (let i = 3; i < 25; i += 3) {
    let ss = "temp" + i;
    let s = eval(ss);
    cornerPostions.push(s);
  }
  cornerPostions.push(center);
  return cornerPostions;
}
