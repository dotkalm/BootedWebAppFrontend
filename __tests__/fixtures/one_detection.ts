import { type CarDetectionResponse } from '@/types';

export const oneDetection: CarDetectionResponse = {
    total_cars: 1,
    detections: [
        {
            car_id: 0,
            car: {
                class: "car",
                confidence: 0.859,
                bbox: {
                    x1: 0,
                    y1: 191,
                    x2: 561,
                    y2: 376,
                    width: 561,
                    height: 184
                }
            },
            wheels: [
                {
                    class: "wheel",
                    confidence: 0.865,
                    bbox: {
                        x1: 139,
                        y1: 286,
                        x2: 228,
                        y2: 372,
                        width: 89,
                        height: 86
                    }
                },
                {
                    class: "wheel",
                    confidence: 0.861,
                    bbox: {
                        x1: 460,
                        y1: 267,
                        x2: 525,
                        y2: 338,
                        width: 65,
                        height: 71
                    }
                }
            ],
            wheel_count: 2,
            wheel_positions: {
                front: {
                    class: "wheel",
                    confidence: 0.865,
                    bbox: {
                        x1: 139,
                        y1: 286,
                        x2: 228,
                        y2: 372,
                        width: 89,
                        height: 86
                    }
                },
                rear: {
                    class: "wheel",
                    confidence: 0.861,
                    bbox: {
                        x1: 460,
                        y1: 267,
                        x2: 525,
                        y2: 338,
                        width: 65,
                        height: 71
                    }
                }
            },
            rear_wheel_transform: {
                position: {
                    x: 0.5390625,
                    y: -0.26041666666666674,
                    z: -0.37857142857142856,
                    pixel_x: 492.5,
                    pixel_y: 302.5
                },
                rotation: {
                    rotation_matrix: [
                        [
                            0.0,
                            -0.008575736418754993,
                            -0.9999632276963369
                        ],
                        [
                            0.0,
                            0.9999632276963369,
                            -0.008575736418754993
                        ],
                        [
                            1.0,
                            -0.0,
                            0.0
                        ]
                    ],
                    basis_vectors: {
                        x_axis: [
                            0.0,
                            0.0,
                            1.0
                        ],
                        y_axis: [
                            -0.008575736418754993,
                            0.9999632276963369,
                            -0.0
                        ],
                        z_axis: [
                            -0.9999632276963369,
                            -0.008575736418754993,
                            0.0
                        ]
                    },
                    euler_angles: {
                        x: 0.008575841536829077,
                        y: -1.5707963267948966,
                        z: 0,
                        order: "XYZ"
                    },
                    quaternion: {
                        x: 0.0030320085612980502,
                        y: -0.7071002806703475,
                        z: 0.0030320085612980502,
                        w: 0.7071002806703476
                    },
                    metadata: {
                        viewing_angle_rad: 0.414064863967226,
                        viewing_angle_deg: 23.724169149980607,
                        ground_angle_rad: -0.10959150221679333,
                        ground_angle_deg: -6.279130547520863,
                        wheel_to_wheel_2d: [
                            -0.9963427285311823,
                            0.08544686830445414
                        ],
                        viewing_side: "left",
                        target_wheel: "rear",
                        ellipse_angle_deg: 89.29469299316406,
                        ellipse_viewing_angle_deg: 33.57399252990277,
                        used_ellipse: true
                    }
                },
                scale: {
                    uniform: 0.24285714285714285,
                    radius_pixels: 34.0
                },
                bounding_box: {
                    x1: 460,
                    y1: 267,
                    x2: 525,
                    y2: 338,
                    width: 65,
                    height: 71
                },
                confidence: 0.861
            },
            rear_wheel_ellipse: {
                center: [
                    493.1631317138672,
                    303.7198600769043
                ],
                axes: [
                    30.723779678344727,
                    25.598203659057617
                ],
                angle: 89.29469299316406,
                axis_ratio: 0.833172348163276,
                viewing_angle_deg: 33.57399252990277,
                confidence: 0.7085883815824001,
                dark_ring_ratio: 0.6666666666666666,
                avg_brightness: 82.41666666666667,
                has_dark_ring: true,
                method: "contour_fit_dark_validated"
            },
            front_wheel_transform: {
                position: {
                    x: -0.42656249999999996,
                    y: -0.37083333333333335,
                    z: -0.34375,
                    pixel_x: 183.5,
                    pixel_y: 329.0
                },
                rotation: {
                    rotation_matrix: [
                        [
                            0.0,
                            -0.008575736418754993,
                            -0.9999632276963369
                        ],
                        [
                            0.0,
                            0.9999632276963369,
                            -0.008575736418754993
                        ],
                        [
                            1.0,
                            -0.0,
                            0.0
                        ]
                    ],
                    basis_vectors: {
                        x_axis: [
                            0.0,
                            0.0,
                            1.0
                        ],
                        y_axis: [
                            -0.008575736418754993,
                            0.9999632276963369,
                            -0.0
                        ],
                        z_axis: [
                            -0.9999632276963369,
                            -0.008575736418754993,
                            0.0
                        ]
                    },
                    euler_angles: {
                        x: 0.008575841536829077,
                        y: -1.5707963267948966,
                        z: 0,
                        order: "XYZ"
                    },
                    quaternion: {
                        x: 0.0030320085612980502,
                        y: -0.7071002806703475,
                        z: 0.0030320085612980502,
                        w: 0.7071002806703476
                    },
                    metadata: {
                        viewing_angle_rad: 0.414064863967226,
                        viewing_angle_deg: 23.724169149980607,
                        ground_angle_rad: -0.10959150221679333,
                        ground_angle_deg: -6.279130547520863,
                        wheel_to_wheel_2d: [
                            -0.9963427285311823,
                            0.08544686830445414
                        ],
                        viewing_side: "left",
                        target_wheel: "rear",
                        ellipse_angle_deg: 83.36383056640625,
                        ellipse_viewing_angle_deg: 17.151454385325803,
                        used_ellipse: true
                    }
                },
                scale: {
                    uniform: 0.3125,
                    radius_pixels: 43.75
                },
                bounding_box: {
                    x1: 139,
                    y1: 286,
                    x2: 228,
                    y2: 372,
                    width: 89,
                    height: 86
                },
                confidence: 0.865
            },
            front_wheel_ellipse: {
                center: [
                    184.4587860107422,
                    334.1755065917969
                ],
                axes: [
                    35.241966247558594,
                    33.674705505371094
                ],
                angle: 83.36383056640625,
                axis_ratio: 0.9555285669596806,
                viewing_angle_deg: 17.151454385325803,
                confidence: 0.44022953211370386,
                dark_ring_ratio: 0.0,
                avg_brightness: 115.02777777777777,
                has_dark_ring: false,
                method: "contour_fit_dark_validated"
            },
            car_geometry: {
                wheel_to_wheel_2d: [
                    -0.9963427285311823,
                    0.08544686830445414
                ],
                ground_angle_deg: -6.279130547520863,
                viewing_side: "left"
            }
        }
    ],
    image_dimensions: {
        width: 640,
        height: 480
    }
};

export const twoDetection: CarDetectionResponse = {
    total_cars: 1,
    detections: [
        {
            car_id: 0,
            car: {
                class: "car",
                confidence: 0.918,
                bbox: {
                    x1: 25,
                    y1: 115,
                    x2: 606,
                    y2: 327,
                    width: 581,
                    height: 212
                }
            },
            wheels: [
                {
                    class: "wheel",
                    confidence: 0.909,
                    bbox: {
                        x1: 116,
                        y1: 241,
                        x2: 222,
                        y2: 327,
                        width: 106,
                        height: 86
                    }
                },
                {
                    class: "wheel",
                    confidence: 0.875,
                    bbox: {
                        x1: 482,
                        y1: 241,
                        x2: 574,
                        y2: 317,
                        width: 92,
                        height: 76
                    }
                }
            ],
            wheel_count: 2,
            wheel_positions: {
                front: {
                    class: "wheel",
                    confidence: 0.909,
                    bbox: {
                        x1: 116,
                        y1: 241,
                        x2: 222,
                        y2: 327,
                        width: 106,
                        height: 86
                    }
                },
                rear: {
                    class: "wheel",
                    confidence: 0.875,
                    bbox: {
                        x1: 482,
                        y1: 241,
                        x2: 574,
                        y2: 317,
                        width: 92,
                        height: 76
                    }
                }
            },
            rear_wheel_transform: {
                position: {
                    x: 0.6499999999999999,
                    y: -0.1625000000000001,
                    z: -0.35,
                    pixel_x: 528.0,
                    pixel_y: 279.0
                },
                rotation: {
                    rotation_matrix: [
                        [
                            0.0,
                            -0.0013927563093516172,
                            -0.9999990301144611
                        ],
                        [
                            0.0,
                            0.9999990301144611,
                            -0.0013927563093516172
                        ],
                        [
                            1.0,
                            -0.0,
                            0.0
                        ]
                    ],
                    basis_vectors: {
                        x_axis: [
                            0.0,
                            0.0,
                            1.0
                        ],
                        y_axis: [
                            -0.0013927563093516172,
                            0.9999990301144611,
                            -0.0
                        ],
                        z_axis: [
                            -0.9999990301144611,
                            -0.0013927563093516172,
                            0.0
                        ]
                    },
                    euler_angles: {
                        x: 0.0013927567596231931,
                        y: -1.5707963267948966,
                        z: 0,
                        order: "XYZ"
                    },
                    quaternion: {
                        x: 0.0004924138348377176,
                        y: -0.7071066097333664,
                        z: 0.0004924138348377176,
                        w: 0.7071066097333664
                    },
                    metadata: {
                        viewing_angle_rad: 0.0,
                        viewing_angle_deg: 0.0,
                        ground_angle_rad: -0.027847952195555522,
                        ground_angle_deg: -1.595570128887406,
                        wheel_to_wheel_2d: [
                            -0.9999030254129323,
                            0.013926225980681509
                        ],
                        viewing_side: "left",
                        target_wheel: "rear",
                        ellipse_angle_deg: 139.27366638183594,
                        ellipse_viewing_angle_deg: 31.64811848389183,
                        used_ellipse: true
                    }
                },
                scale: {
                    uniform: 0.3,
                    radius_pixels: 42.0
                },
                bounding_box: {
                    x1: 482,
                    y1: 241,
                    x2: 574,
                    y2: 317,
                    width: 92,
                    height: 76
                },
                confidence: 0.875
            },
            rear_wheel_ellipse: {
                center: [
                    530.2939376831055,
                    285.19324493408203
                ],
                axes: [
                    29.4957218170166,
                    25.109312057495117
                ],
                angle: 139.27366638183594,
                axis_ratio: 0.8512865768556683,
                viewing_angle_deg: 31.64811848389183,
                confidence: 0.7972479398774479,
                dark_ring_ratio: 1.0,
                avg_brightness: 27.11111111111111,
                has_dark_ring: true,
                method: "contour_fit_dark_validated"
            },
            front_wheel_transform: {
                position: {
                    x: -0.47187500000000004,
                    y: -0.18333333333333335,
                    z: -0.32857142857142857,
                    pixel_x: 169.0,
                    pixel_y: 284.0
                },
                rotation: {
                    rotation_matrix: [
                        [
                            0.0,
                            -0.0013927563093516172,
                            -0.9999990301144611
                        ],
                        [
                            0.0,
                            0.9999990301144611,
                            -0.0013927563093516172
                        ],
                        [
                            1.0,
                            -0.0,
                            0.0
                        ]
                    ],
                    basis_vectors: {
                        x_axis: [
                            0.0,
                            0.0,
                            1.0
                        ],
                        y_axis: [
                            -0.0013927563093516172,
                            0.9999990301144611,
                            -0.0
                        ],
                        z_axis: [
                            -0.9999990301144611,
                            -0.0013927563093516172,
                            0.0
                        ]
                    },
                    euler_angles: {
                        x: 0.0013927567596231931,
                        y: -1.5707963267948966,
                        z: 0,
                        order: "XYZ"
                    },
                    quaternion: {
                        x: 0.0004924138348377176,
                        y: -0.7071066097333664,
                        z: 0.0004924138348377176,
                        w: 0.7071066097333664
                    },
                    metadata: {
                        viewing_angle_rad: 0.0,
                        viewing_angle_deg: 0.0,
                        ground_angle_rad: -0.027847952195555522,
                        ground_angle_deg: -1.595570128887406,
                        wheel_to_wheel_2d: [
                            -0.9999030254129323,
                            0.013926225980681509
                        ],
                        viewing_side: "left",
                        target_wheel: "rear",
                        ellipse_angle_deg: 19.68017578125,
                        ellipse_viewing_angle_deg: 27.78719403266232,
                        used_ellipse: true
                    }
                },
                scale: {
                    uniform: 0.34285714285714286,
                    radius_pixels: 48.0
                },
                bounding_box: {
                    x1: 116,
                    y1: 241,
                    x2: 222,
                    y2: 327,
                    width: 106,
                    height: 86
                },
                confidence: 0.909
            },
            front_wheel_ellipse: {
                center: [
                    168.2434310913086,
                    287.0167236328125
                ],
                axes: [
                    59.062721252441406,
                    52.251914978027344
                ],
                angle: 19.68017578125,
                axis_ratio: 0.8846851934690948,
                viewing_angle_deg: 27.78719403266232,
                confidence: 0.739453550652083,
                dark_ring_ratio: 0.5,
                avg_brightness: 80.46428571428571,
                has_dark_ring: true,
                method: "contour_fit_dark_validated"
            },
            car_geometry: {
                wheel_to_wheel_2d: [
                    -0.9999030254129323,
                    0.013926225980681509
                ],
                ground_angle_deg: -1.595570128887406,
                viewing_side: "left"
            }
        }
    ],
    image_dimensions: {
        width: 640,
        height: 480
    },
};

export const fixtureFromScreenshot: CarDetectionResponse = {
    total_cars: 1,
    detections: [
        {
            car_id: 0,
            car: {
                class: "car",
                confidence: 0.899,
                bbox: {
                    x1: 15,
                    y1: 175,
                    x2: 613,
                    y2: 418,
                    width: 597,
                    height: 243
                }
            },
            wheels: [
                {
                    class: "wheel",
                    confidence: 0.911,
                    bbox: {
                        x1: 75,
                        y1: 311,
                        x2: 192,
                        y2: 417,
                        width: 117,
                        height: 106
                    }
                },
                {
                    class: "wheel",
                    confidence: 0.877,
                    bbox: {
                        x1: 466,
                        y1: 314,
                        x2: 566,
                        y2: 410,
                        width: 100,
                        height: 96
                    }
                }
            ],
            wheel_count: 2,
            wheel_positions: {
                front: {
                    class: "wheel",
                    confidence: 0.911,
                    bbox: {
                        x1: 75,
                        y1: 311,
                        x2: 192,
                        y2: 417,
                        width: 117,
                        height: 106
                    }
                },
                rear: {
                    class: "wheel",
                    confidence: 0.877,
                    bbox: {
                        x1: 466,
                        y1: 314,
                        x2: 566,
                        y2: 410,
                        width: 100,
                        height: 96
                    }
                }
            },
            rear_wheel_transform: {
                position: {
                    x: 0.6125,
                    y: -0.5083333333333333,
                    z: -0.325,
                    pixel_x: 516.0,
                    pixel_y: 362.0
                },
                rotation: {
                    rotation_matrix: [
                        [
                            0.0,
                            -0.0005228757455165847,
                            -0.9999998633004681
                        ],
                        [
                            0.0,
                            0.9999998633004681,
                            -0.0005228757455165847
                        ],
                        [
                            1.0,
                            -0.0,
                            0.0
                        ]
                    ],
                    basis_vectors: {
                        x_axis: [
                            0.0,
                            0.0,
                            1.0
                        ],
                        y_axis: [
                            -0.0005228757455165847,
                            0.9999998633004681,
                            -0.0
                        ],
                        z_axis: [
                            -0.9999998633004681,
                            -0.0005228757455165847,
                            0.0
                        ]
                    },
                    euler_angles: {
                        x: 0.0005228757693422092,
                        y: -1.5707963267948966,
                        z: 0,
                        order: "XYZ"
                    },
                    quaternion: {
                        x: 0.00018486449900409702,
                        y: -0.7071067570212557,
                        z: 0.00018486449900409702,
                        w: 0.7071067570212556
                    },
                    metadata: {
                        viewing_angle_rad: 0.0,
                        viewing_angle_deg: 0.0,
                        ground_angle_rad: -0.018298610957329993,
                        ground_angle_deg: -1.0484331788068515,
                        wheel_to_wheel_2d: [
                            -0.9999863303242953,
                            0.005228686694506119
                        ],
                        viewing_side: "left",
                        target_wheel: "rear",
                        ellipse_angle_deg: 165.62903594970703,
                        ellipse_viewing_angle_deg: 35.48901151500096,
                        used_ellipse: true
                    }
                },
                scale: {
                    uniform: 0.35,
                    radius_pixels: 49.0
                },
                bounding_box: {
                    x1: 466,
                    y1: 314,
                    x2: 566,
                    y2: 410,
                    width: 100,
                    height: 96
                },
                confidence: 0.877
            },
            rear_wheel_ellipse: {
                center: [
                    516.476188659668,
                    351.37457275390625
                ],
                axes: [
                    56.74100875854492,
                    46.20005416870117
                ],
                angle: 165.62903594970703,
                axis_ratio: 0.8142268736409038,
                viewing_angle_deg: 35.48901151500096,
                confidence: 0.9143174626801613,
                dark_ring_ratio: 1.0,
                avg_brightness: 37.4,
                has_dark_ring: true,
                method: "contour_fit_dark_validated"
            },
            front_wheel_transform: {
                position: {
                    x: -0.5828125,
                    y: -0.5166666666666666,
                    z: -0.3008928571428572,
                    pixel_x: 133.5,
                    pixel_y: 364.0
                },
                rotation: {
                    rotation_matrix: [
                        [
                            0.0,
                            -0.0005228757455165847,
                            -0.9999998633004681
                        ],
                        [
                            0.0,
                            0.9999998633004681,
                            -0.0005228757455165847
                        ],
                        [
                            1.0,
                            -0.0,
                            0.0
                        ]
                    ],
                    basis_vectors: {
                        x_axis: [
                            0.0,
                            0.0,
                            1.0
                        ],
                        y_axis: [
                            -0.0005228757455165847,
                            0.9999998633004681,
                            -0.0
                        ],
                        z_axis: [
                            -0.9999998633004681,
                            -0.0005228757455165847,
                            0.0
                        ]
                    },
                    euler_angles: {
                        x: 0.0005228757693422092,
                        y: -1.5707963267948966,
                        z: 0,
                        order: "XYZ"
                    },
                    quaternion: {
                        x: 0.00018486449900409702,
                        y: -0.7071067570212557,
                        z: 0.00018486449900409702,
                        w: 0.7071067570212556
                    },
                    metadata: {
                        viewing_angle_rad: 0.0,
                        viewing_angle_deg: 0.0,
                        ground_angle_rad: -0.018298610957329993,
                        ground_angle_deg: -1.0484331788068515,
                        wheel_to_wheel_2d: [
                            -0.9999863303242953,
                            0.005228686694506119
                        ],
                        viewing_side: "left",
                        target_wheel: "rear",
                        ellipse_angle_deg: 141.24238204956055,
                        ellipse_viewing_angle_deg: 28.362873812035303,
                        used_ellipse: true
                    }
                },
                scale: {
                    uniform: 0.3982142857142857,
                    radius_pixels: 55.75
                },
                bounding_box: {
                    x1: 75,
                    y1: 311,
                    x2: 192,
                    y2: 417,
                    width: 117,
                    height: 106
                },
                confidence: 0.911
            },
            front_wheel_ellipse: {
                center: [
                    125.28988647460938,
                    367.52384185791016
                ],
                axes: [
                    55.93301010131836,
                    49.21862030029297
                ],
                angle: 141.24238204956055,
                axis_ratio: 0.8799565804010406,
                viewing_angle_deg: 28.362873812035303,
                confidence: 0.839187776012658,
                dark_ring_ratio: 0.8888888888888888,
                avg_brightness: 57.611111111111114,
                has_dark_ring: true,
                method: "contour_fit_dark_validated"
            },
            car_geometry: {
                wheel_to_wheel_2d: [
                    -0.9999863303242953,
                    0.005228686694506119
                ],
                ground_angle_deg: -1.0484331788068515,
                viewing_side: "left"
            }
        }
    ],
    image_dimensions: {
        width: 640,
        height: 480
    }
}
