// src/screens/Search.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import IonIcon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/SearchStyles";

type Track = {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
};

const Search = () => {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://192.168.1.81:3000/api/spotify/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch tracks");

      const data = await res.json();
      setTracks(data);
    } catch (err: any) {
      setError(err.message || "Error fetching tracks");
    } finally {
      setLoading(false);
    }
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => navigation.navigate('TrackDetails', { track: item })}
    >
      <Image source={{ uri: item.album.images[0]?.url }} style={styles.albumImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.trackName}>{item.name}</Text>
        <Text style={styles.artistName}>{item.artists.map(a => a.name).join(", ")}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <IonIcon name="search" size={20} color="#999" style={{ marginHorizontal: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tracks..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchTracks}
          returnKeyType="search"
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={renderTrackItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={!loading ? <Text style={styles.noResults}>No tracks found</Text> : null}
      />
    </View>
  );
};

export default Search;
