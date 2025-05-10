import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
  },
  chatIcon: {
    padding: 4,
  },
  menuIcon: {
    padding: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  // Song Card
  songCard: {
    width: 160,
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
  },
  songText: {
    color: '#EAEAEA',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  songImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: 6,
  },

  // Artist Card
  artistCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#242424',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  artistImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  artistText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    flexWrap: 'wrap',
  },

  noDataText: {
    color: '#bbb',
    fontSize: 14,
    marginTop: 5,
  },
});

export default styles;
