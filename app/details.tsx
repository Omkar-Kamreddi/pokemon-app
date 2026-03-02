import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface PokemonDetails {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;

    abilities: {
        ability: { name: string };
        is_hidden: boolean;
    }[];

    stats: {
        base_stat: number;
        stat: { name: string };
    }[];

    moves: {
        move: { name: string };
    }[];

    sprites: {
        other: {
            "official-artwork": {
                front_default: string;
            };
        };
    };

    types: {
        type: { name: string };
    }[];
}
const colorsByType: Record<string, string> = {
    grass: "#48D0B0",
    fire: "#FB6C6C",
    water: "#76BEFE",
    electric: "#FFD86F",
    bug: "#A8B820",
    normal: "#A8A77A",
};

export default function DetailsScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const navigation = useNavigation();
    const [details, setDetails] = useState<PokemonDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (name) fetchDetails(name);
    }, [name]);

    const fetchDetails = async (pokemonName: string) => {
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
            );
            const data = await response.json();
            setDetails(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerStyle: { backgroundColor: "transparent" },
            headerShadowVisible: false,
        });
    }, [navigation]);

    if (loading)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );

    if (!details) return null;

    const primaryType = details.types[0]?.type.name;
    const bgColor = colorsByType[primaryType] || "#999";

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            {/* HEADER SECTION */}
            <View style={styles.header}>
                <Text style={styles.name}>
                    {details.name}
                </Text>

                <View style={styles.typeRow}>
                    {details.types.map((t, i) => (
                        <View key={i} style={styles.typeBadge}>
                            <Text style={styles.typeText}>
                                {t.type.name}
                            </Text>
                        </View>
                    ))}
                </View>

                <Image
                    source={{
                        uri: details.sprites.other["official-artwork"]
                            .front_default,
                    }}
                    style={styles.image}
                />
            </View>

            {/* BOTTOM WHITE CARD */}
            <ScrollView style={styles.bottomCard}>
                <ScrollView style={styles.bottomCard}>

                    <Text style={styles.sectionTitle}>About</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Height</Text>
                            <Text style={styles.value}>
                                {details.height / 10} m
                            </Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Weight</Text>
                            <Text style={styles.value}>
                                {details.weight / 10} kg
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Base Experience</Text>
                    <Text style={styles.simpleText}>
                        {details.base_experience}
                    </Text>

                    <Text style={styles.sectionTitle}>Abilities</Text>
                    {details.abilities.map((a, index) => (
                        <Text key={index} style={styles.simpleText}>
                            • {a.ability.name}
                            {a.is_hidden ? " (Hidden)" : ""}
                        </Text>
                    ))}

                    <Text style={styles.sectionTitle}>Stats</Text>
                    {details.stats.map((s, index) => (
                        <View key={index} style={{ marginBottom: 8 }}>
                            <Text style={styles.simpleText}>
                                {s.stat.name.toUpperCase()} : {s.base_stat}
                            </Text>
                        </View>
                    ))}

                    <Text style={styles.sectionTitle}>Moves</Text>
                    {details.moves.slice(0, 10).map((m, index) => (
                        <Text key={index} style={styles.simpleText}>
                            • {m.move.name}
                        </Text>
                    ))}

                    <Text style={styles.sectionTitle}>ID</Text>
                    <Text style={styles.simpleText}>
                        #{details.id}
                    </Text>

                </ScrollView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        height: 300,
        paddingTop: 80,
        paddingHorizontal: 20,
    },

    name: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
        textTransform: "capitalize",
    },

    typeRow: {
        flexDirection: "row",
        marginTop: 10,
    },

    typeBadge: {
        backgroundColor: "rgba(255,255,255,0.25)",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 10,
    },

    typeText: {
        color: "#fff",
        textTransform: "capitalize",
    },

    image: {
        width: 150,
        height: 150,
        alignSelf: "center",
        marginTop: -10,
    },

    bottomCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },

    infoBox: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        padding: 20,
        borderRadius: 18,
        marginHorizontal: 5,
        alignItems: "center",
    },

    label: {
        fontSize: 13,
        color: "gray",
    },

    value: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 5,
    },

    simpleText: {
        fontSize: 16,
        marginBottom: 20,
    },
});