import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const styles = StyleSheet.create({
    viewProp: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.card_background
    },

    tabBarStyle: {
        backgroundColor: Colors.background,
        paddingBottom: 14,
        height: 75,
    },

    tabBarLabelStyle: {
        fontSize: 12, 
        fontWeight: 'bold'
    },

});
export default styles;