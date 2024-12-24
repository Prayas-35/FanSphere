import { access } from "fs";
import { NextResponse, NextRequest } from "next/server";

async function refreshAccessToken(refreshToken: string) {
    console.log("Refreshing access token...");
    console.log("refreshToken", refreshToken);
    console.log("access_token", process.env.SPOTIFY_CLIENT_ID);
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID || '',
            client_secret: process.env.SPOTIFY_CLIENT_SECRET || '',
        }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log("response", response);

    if (response.refresh_token) {
        return {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
        }
    }
    return {
        access_token: response.access_token,
        refresh_token: refreshToken,
    }
}



async function getUserData(code: string) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${code}`,
        },
    });
    const userData = await response.json();
    const data = {
        "id": userData.id,
        "name": userData?.display_name,
        "url": userData.external_urls.spotify,
        "email": userData.email,
        "followers": userData.followers?.total,
        "image": userData.images[0]?.url,
    }
    return data;
}

async function getTopArtists(code: string) {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50', {
        headers: {
            Authorization: `Bearer ${code}`,
        },
    });
    const data = await response.json();
    const topArtists = data.items.map((artist: any) => {
        return {
            "id": artist.id,
            "name": artist?.name,
            "url": artist.external_urls.spotify,
            "followers": artist.followers.total,
            "image": artist.images[0].url,
            "genres": artist.genres,
            "popularity": artist.popularity,
        }
    });
    return topArtists;
}

async function getTopTracks(code: string) {
    const response1 = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', {
        headers: {
            Authorization: `Bearer ${code}`,
        },
    });
    const data1 = await response1.json();
    const response2 = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50&offset=50', {
        headers: {
            Authorization: `Bearer ${code}`,
        },
    });
    const data2 = await response2.json();
    const data = data1.items.concat(data2.items);
    const topTracks = data.map((track: any) => {
        return {
            "id": track.id,
            "album": track.album?.name,
            "image": track.album.images[0].url,
            "release_date": track.album.release_date,
            "name": track?.name,
            "url": track.external_urls.spotify,
            "popularity": track.popularity,
            "artists": track.artists.map((artist: any) => {
                return {
                    "id": artist.id,
                    "name": artist?.name,
                    "url": artist.external_urls.spotify,
                }
            }),
        }
    });
    return topTracks;


}

async function checkUserFollows(code: string, ids: string) {
    const response = await fetch(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${ids}`, {
        headers: {
            Authorization: `Bearer ${code}`,
        },
    });
    return await response.json();
}



async function posthandler(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 400 });
    }
    const refreshHeader = req.headers.get('refresh');
    if (!refreshHeader || !refreshHeader.startsWith('Refresh ')) {
        return NextResponse.json({ error: 'Missing or invalid refresh header' }, { status: 400 });
    }
    const refreshToken = refreshHeader.split(' ')[1];
    const accessToken = authHeader.split(' ')[1];
    try {
    const topArtists = await getTopArtists(accessToken);
    const topTracks = await getTopTracks(accessToken);
    const userData = await getUserData(accessToken);
    
    return NextResponse.json({
        userData,
        topArtists,
        topTracks,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
    }
    catch (error) {
        try {
            const { access_token: newAccessToken, refresh_token: newRefreshToken } = await refreshAccessToken(refreshToken);
            const newUserData = await getUserData(newAccessToken);
            const newTopArtists = await getTopArtists(newAccessToken);
            const newTopTracks = await getTopTracks(newAccessToken);
            return NextResponse.json({
                userData: newUserData,
                topArtists: newTopArtists,
                topTracks: newTopTracks,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
        }
        catch (error) {
            console.log("Error", error);
            console.log("Invalid access token", accessToken);
            return NextResponse.json({ error: 'Invalid access token' }, { status: 400 });
        }
    }
}

export {
    posthandler as POST,
}