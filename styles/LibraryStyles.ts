import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: Colors.container,
        flexGrow: 1
      },
      header: {
        fontSize: 24,
        color: Colors.text,
        marginBottom: 10,
        fontWeight: 'bold'
      },
      subHeader: {
        fontSize: 18,
        color: Colors.subText,
        marginBottom: 8
      },
      playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card_background,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: Colors.text,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2
      },
      likedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card_background,
        padding: 12,
        borderRadius: 10,
        marginBottom: 20
      },
      playlistName: {
        color: Colors.text,
        fontSize: 16,
        marginLeft: 12
      },
      emptyText: {
        color: Colors.nodata_text,
        textAlign: 'center',
        marginVertical: 20
      },
      createSection: {
        marginTop: 30,
        backgroundColor: Colors.card_background,
        padding: 16,
        borderRadius: 10
      },
      input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 10,
        color: Colors.text,
        marginBottom: 12
      },
      createButton: {
        backgroundColor: Colors.buttonBackground,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
      },
      createText: {
        color: Colors.buttonText,
        fontWeight: 'bold'
      }
});

export default styles;