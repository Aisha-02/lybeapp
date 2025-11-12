import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const styles = StyleSheet.create({
    viewProp: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },

    tabBarStyle: {
        backgroundColor: Colors.googletextcolor,
        paddingBottom: 14,
        height: 75,
    },

    tabBarLabelStyle: {
        fontSize: 12, 
        fontWeight: 'bold'
    },

});
export default styles;