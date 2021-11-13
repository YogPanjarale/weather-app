import { GetServerSideProps } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";
import ShareButton from "../components/ShareButton";
export interface WeatherData {
	coord: Coord;
	weather: Weather[];
	base: string;
	main: Main;
	visibility: number;
	wind: Wind;
	clouds: Clouds;
	dt: number;
	sys: Sys;
	timezone: number;
	id: number;
	name: string;
	cod: number;
}

export interface Coord {
	lon: number;
	lat: number;
}

export interface Weather {
	id: number;
	main: string;
	description: string;
	icon: string;
}

export interface Main {
	temp: number;
	feels_like: number;
	temp_min: number;
	temp_max: number;
	pressure: number;
	humidity: number;
	sea_level: number;
	grnd_level: number;
}

export interface Wind {
	speed: number;
	deg: number;
	gust: number;
}

export interface Clouds {
	all: number;
}

export interface Sys {
	country: string;
	sunrise: number;
	sunset: number;
}
const share = (title: string, url: string) => {
	if (navigator.share) {
		navigator
			.share({
				title: title,
				url: url,
			})
			.then(() => {
				console.log("Thanks for sharing!");
			})
			.catch(console.error);
	} else {
		// fallback
	}
};
function WeatherCard({ data, error }: { data: WeatherData; error?: string }) {
	return (
		<>
			<div className="max-w-sm rounded overflow-hidden shadow-lg md:w-1/3 p-4 bg-gradient-to-tl from-red-500  to-yellow-500 text-white">
				{error ? (
					<div>{error}</div>
				) : (
					<>
						<h1 className="text-4xl">
							{data.name}, {data.sys.country}
						</h1>
						<div className="text-6xl">
							{Math.round(data.main.temp)}°C
						</div>
						<div>
							<Image
								src={`https://openweathermap.org/img/w/${data.weather[0].icon}.png`}
								alt={data.weather[0].description}
								width={50}
								height={50}
								layout="intrinsic"
							/>
						</div>
						<div className="text-3xl">
							{data.weather[0].main}
							<p className="text-lg">
								{data.weather[0].description}
							</p>
						</div>
						<div className="text-xl">
							Feels like: {Math.round(data.main.feels_like)}°C
						</div>
						<div className="text-xl">
							Humidity : {Math.round(data.main.humidity)}%
						</div>
						<div className="text-xl">
							Wind: {data.wind.speed}km/h
						</div>
						<div className="inline-flex">
							<p>
								SunRise :{" "}
								{new Date(
									data.sys.sunrise * 1000
								).toLocaleTimeString()}
							</p>
							{" "}
							<p>
								SunSet :{" "}
								{new Date(
									data.sys.sunset * 1000
								).toLocaleTimeString()}
							</p>
						</div>
					</>
				)}
			</div>
			<div className="flex flex-row max-w-sm ">
				<Link href="/" passHref>
					<button className="bg-darkgreen hover:bg-darkgreen-dark text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline border-gray-200 border-2 focus:bg-white focus:bg-opacity-10 min-w-full ">
						Back
					</button>
				</Link>
				<button
					className="w-full h-full text-white"
					onClick={() =>
						share(
							`Weather in ${data.name}, ${data.sys.country}`,
							`${window.location.hostname}/?city=${data.name}`
						)
					}
				>
					<ShareButton />
				</button>
			</div>
		</>
	);
}
export default function Home({
	data,
	error,
}: {
	data?: WeatherData;
	error?: string;
}) {
	// console.log(data);
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
			{data ? (
				<Head>
					<title>
						Weather in {data.name},{data.sys.country}
					</title>
					<meta
						name="description"
						content={`Weather in ${data.name}, ${data.sys.country} is ${data.weather[0].description} with the temperature of ${data.main.temp}°C `}
					/>
					<link rel="icon" href="/favicon.ico" />
				</Head>
			) : (
				<Head>
					<title>Weather App</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
			)}

			<main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center space-y-5">
				{data ? null : (
					<h1 className="text-4xl font-bold text-white">
						<Link href="/">Weather App</Link>
					</h1>
				)}
				{data ? (
					<WeatherCard data={data} error={error} />
				) : (
					<form className="md:w-1/3 flex flex-col space-y-5 items-center">
						<input
							className="appearance-none border-2 border-gray-200 rounded-full w-full py-2 px-4 focus:outline-none focus:bg-white focus:border-darkgreen
                         leading-10  font-poppins text-lg font-normal"
							id="city"
							name="city"
							type="text"
							placeholder="Search City"
						/>
						<button
							className="bg-darkgreen hover:bg-darkgreen-dark text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline border-gray-200 border-2 w-2/3 focus:bg-white focus:bg-opacity-10"
							type="submit"
						>
							Search Weather
						</button>
					</form>
				)}
			</main>
			<div className="text-white w-full">
				<Footer />
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	// console.log(context.query);

	if (!!context.query.city) {
		try {
			const res = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${context.query.city}&appid=${process.env.APPID}&units=metric`
			);
			const data = await res.json();
			console.log(data);

			if (data.cod != 200) {
				return {
					props: {
						data: null,
						error: data.message,
					},
				};
			}
			return { props: { data } };
		} catch (err) {
			console.log(err);
			// return { props: { data: null ,error:`${err}`} };
		}
	}
	return { props: { data: null } };
};
