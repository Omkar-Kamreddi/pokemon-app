import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
  };
}

const colorsByType: Record<string, string> = {
  grass: "#48D0B0",
  fire: "#FB6C6C",
  water: "#76BEFE",
  electric: "#FFD86F",
  bug: "#A8B820",
  normal: "#A8A77A",
};

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/?limit=1000"
    );
    const data = await response.json();

    const detailed = await Promise.all(
      data.results.map(async (pokemon: any) => {
        const res = await fetch(pokemon.url);
        const details = await res.json();

        return {
          name: pokemon.name,
          image:
            details.sprites.other["official-artwork"]
              .front_default,
          types: details.types,
        };
      })
    );

    setPokemons(detailed);
  };

  return (
    <FlatList
      data={pokemons}
      numColumns={2}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.container}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      renderItem={({ item }) => {
        const primaryType = item.types[0]?.type.name;
        const bgColor =
          colorsByType[primaryType] || "#999";

        return (
          <Link
            href={{
              pathname: "/details",
              params: { name: item.name },
            }}
            style={[
              styles.card,
              { backgroundColor: bgColor },
            ]}
          >
            <View style={styles.cardInner}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>
                  {primaryType}
                </Text>
              </View>

              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />
            </View>
          </Link>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2f2f2",
  },

  card: {
    width: "48%",
    height: 170,
    borderRadius: 22,
    padding: 15,
    marginBottom: 16,
    overflow: "hidden",
  },

  cardInner: {
    flex: 1,
    position: "relative",
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },

  typeBadge: {
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  typeText: {
    color: "#fff",
    fontSize: 12,
    textTransform: "capitalize",
  },

  image: {
    width: 110,
    height: 110,
    position: "absolute",
    bottom: -100,
    right: -40,
  },
});