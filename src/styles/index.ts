export const styles = {
    sliderHorizontal: {
        bottom: {
            xs: '20px',
            sm: '1vh',
        },
        width: '80%',
        maxWidth: '400px',
        zIndex: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        position: 'absolute',
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
        overflow: 'hidden',
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
        padding: 0,
        position: 'relative',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000',
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
        borderRadius: {
            xs: 0,
            sm: '16px'
        },
        border: 'none',
        objectFit: 'cover',
        maxWidth: '100%',
        maxHeight: '100%',
        width: {
            xs: '100%',
            sm: 'auto'
        },
        height: {
            xs: '100%',
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
        fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        zIndex: 10,
    },
    zoomInfoContainer: {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            sm: 'column',
        },
        justifyContent: {
            xs: 'flex-end',
            sm: 'center',
        },
        alignItems: {
            xs: 'center',
            sm: 'start',
        },
        width: {
            xs: '100%',
            sm: '70%',
        },
        height: {
            xs: 'auto',
            sm: '100%',
        },
        gap: {
            xs: '0',
            sm: '10vh',
        },
        paddingBottom: {
            xs: '30px',
            sm: 0,
        }
    },
    shutter: {
        position: 'absolute',
        bottom: '80px',
        borderRadius: '50%',
        width: '68px',
        height: '68px',
        backgroundColor: 'transparent',
        border: '4px solid white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shutterContainer: {
        height: {
            xs: 'auto',
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
        },
        padding: {
            xs: '10px 0',
            sm: 0,
        }
    },
}