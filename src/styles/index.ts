export const styles = {
    sliderHorizontal: {
        bottom: '1vh',
        width: '80%',
        maxWidth: '400px',
        zIndex: 10,
    },
    sliderVertical: {
        height: '300px',
        zIndex: 10,
    },
    webcamContainer: {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            sm: 'row'
        },
        width: '100vw',
        height: '100vh',
    },
    webcam: {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            sm: 'row'
        },
        alignItems: 'center',
        justifyContent: {
            xs: 'flex-start',
            sm: 'center'
        },
        gap: {
            xs: 2,
            sm: 4
        },
        position: 'relative',
    },
    containerNoCanvas: {
        position: 'relative',
        width: {
            xs: 'auto',
            sm: '100vw'
        },
        height: 'auto',
    },
    container: {
        position: 'relative',
        width: {
            xs: 'auto',
            sm: '100vw'
        },
        height: 'auto',
        canvas: {
            top: 0,
            left: 0,
            pointerEvents: 'none',
            position: 'absolute',
            maxWidth: '100%',
            maxHeight: {
                xs: 'calc(100vh - 350px)',
                sm: 'calc(100vh - 100px)'
            },
            width: {
                xs: '95%',
                sm: 'auto'
            },
            height: {
                xs: 'auto',
                sm: '80vh'
            },
        },
    },
    video: {
        borderRadius: '16px',
        border: '4px solid',
        borderColor: 'white',
        objectFit: 'cover',
        maxWidth: '100%',
        maxHeight: {
            xs: 'calc(100vh - 350px)',
            sm: 'calc(100vh - 100px)'
        },
        width: {
            xs: '95%',
            sm: 'auto'
        },
        height: {
            xs: 'auto',
            sm: '80vh'
        },
    },
    zoomInfo: {
        backgroundColor: {
            xs: 'rgba(255, 255, 255, 0.9)',
            sm: 'transparent'
        },
        padding: {
            xs: '8px 16px',
            sm: 0
        },
        borderRadius: {
            xs: '8px',
            sm: 0
        },
        zIndex: 10,
    },
    zoomInfoContainer: {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            sm: 'column',
        },
        justifyContent: 'center',
        alignItems: {
            xs: 'center',
            sm: 'start',
        },
        width: '70%',
        height: {
            xs: '20%',
            sm: '100%',
        },
        gap: {
            xs: '1vh',
            sm: '10vh',
        }
    },
    shutter: {
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        backgroundColor: 'rgba(246, 3, 3, 0.7)',
        borderColor: '#0f0000',
        borderWidth: '2px',
        borderStyle: 'solid',
    },
    shutterContainer: {
        height: {
            xs: '13vh',
            sm: '20vh',
        },
        width: {
            xs: '100vw',
            sm: '15em'
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifyItems: 'center',
        alignContent: 'center',
        flexDirection: {
            xs: 'column',
            sm: 'column',
        }
    },
}