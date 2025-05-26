import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const styles = StyleSheet.create({
  safeArea:{
    flex: 1, 
    backgroundColor: Colors.card_background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.card_background,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    color: Colors.greeting,
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.avatar,
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
    color: Colors.section,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  // Song Card
  songCard: {
    width: 160,
    backgroundColor: Colors.song_card,
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
  },
  songText: {
    color: Colors.song_text,
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
    backgroundColor: Colors.artist_card,
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
    color: Colors.artist_text,
    fontSize: 12,
    textAlign: 'center',
    flexWrap: 'wrap',
  },

  noDataText: {
    color: Colors.nodata_text,
    fontSize: 14,
    marginTop: 5,
  },

  artistCardWrapper: {
    marginHorizontal: 6,
  },

  artistImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  artistNameText: {
    color: Colors.artist_text,
    marginTop: 6,
    fontSize: 12,
  },
});

export default styles;
