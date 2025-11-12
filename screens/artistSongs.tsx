import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import styles from "../styles/SearchStyles";

type Track = {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
};

const ArtistSongs = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { artistId, artistName } = route.params || {};

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (artistId) {
      fetchArtistTracks(artistId);
    }
  }, [artistId]);

  const fetchArtistTracks = async (artistId: string) => {
    setLoading(true);
    setError(null);
    try {
      // const res = await fetch(`http://192.168.1.87:3000/api/spotify/artist-tracks/${artistId}`);
      const res = await fetch(`https://music-app-1-zb1y.onrender.com/api/spotify/artist-tracks/${artistId}`);
      if (!res.ok) throw new Error("Failed to fetch artist tracks");

      const data = await res.json();

      // Filter and map tracks properly
      const artistTracks = data.filter((item: any) => item?.id || item?.track?.id);
      const mappedTracks: Track[] = artistTracks.map((item: any) =>
        item.track
          ? {
              id: item.track.id,
              name: item.track.name,
              album: item.track.album,
              artists: item.track.artists,
            }
          : {
              id: item.id,
              name: item.name,
              album: item.album,
              artists: item.artists,
            }
      );
      setTracks(mappedTracks);
    } catch (err: any) {
      setError(err.message || "Error fetching artist tracks");
    } finally {
      setLoading(false);
    }
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => navigation.navigate("TrackDetails", { track: item })}
    >
      <Image source={{ uri: item.album.images[0]?.url }} style={styles.albumImage} />
      <View style={styles.viewProp}>
        <Text style={styles.trackName}>{item.name}</Text>
        <Text style={styles.artistName}>{item.artists.map((a) => a.name).join(", ")}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{artistName || "Artist Songs"}</Text>

      {loading && <ActivityIndicator size="large" color={Colors.loading} style={styles.loading} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={renderTrackItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          !loading ? <Text style={styles.noResults}>No songs found for this artist</Text> : null
        }
      />
    </View>
  );
};

export default ArtistSongs;
