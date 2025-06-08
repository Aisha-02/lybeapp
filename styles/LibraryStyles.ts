import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#121212',
        flexGrow: 1
      },
      header: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
        fontWeight: 'bold'
      },
      subHeader: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 8
      },
      playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2
      },
      likedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20
      },
      playlistName: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 12
      },
      emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginVertical: 20
      },
      createSection: {
        marginTop: 30,
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 10
      },
      input: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 10,
        color: '#fff',
        marginBottom: 12
      },
      createButton: {
        backgroundColor: '#1db954',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
      },
      createText: {
        color: '#fff',
        fontWeight: 'bold'
      }
});
export default styles;