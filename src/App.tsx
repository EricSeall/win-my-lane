import { useEffect, useState } from "react";
import "./App.css";
import { Name } from "./types";

function App() {
	const [tips, setTips] = useState<Array<string>>();
	const [query, setQuery] = useState<string>("");
	const [championNames, setChampionNames] = useState<Array<Name>>([]);
	const [latestVersion, setLatestVersion] = useState<string>("");
	// get list of champions on app start and load into championNames
	useEffect(() => {
		getChamps();
	}, []);

	async function getChamps() {
		//to get the latest version of league for use with other fetch calls
		const versionInfo = await fetch(
			"https://ddragon.leagueoflegends.com/api/versions.json"
		);
		const version = await versionInfo.json();

		setLatestVersion(version[0]);

		// have to use "version" here because state hasn't updated yet
		const res = await fetch(
			`https://ddragon.leagueoflegends.com/cdn/${version[0]}/data/en_US/champion.json`
		);
		const data = await res.json();

		if (res.ok) {
			// take champions from data and also get their name properties (they have correct spacing and punctuation)
			setChampionNames(
				Object.keys(data.data).map((name) => {
					return { commonName: data.data[name].name, dataName: name };
				})
			);
		}
		console.log(data.data);
	}

	async function queryData(champ: string) {
		const res = await fetch(
			`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${champ}.json`
		);
		const data = await res.json();

		if (res.ok) {
			setTips(data.data[champ].enemytips);
			console.log(data.data[champ].enemytips);
		}
	}

	return (
		<div className="flex h-screen justify-center items-center">
			<div className="block m-auto">
				<h1 className="block text-center m-auto">Win My Lane</h1>
				<input
					className="block mx-auto"
					onChange={(e) => {
						setQuery(e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							queryData(e.target.value);
						}
					}}
					placeholder="Enter Champion Name:"
				/>
				<div>
					{championNames
						.filter((name) => {
							return query.toLowerCase() === ""
								? false
								: name.commonName.toLowerCase().startsWith(query.toLowerCase());
						})
						.map((name, index) => (
							//TODO: make into components
							<>
								<img
									className="inline"
									src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${name.dataName}.png`}
									width="30"
									height="30"
								/>
								<span key={index}>
									{name.commonName}
									<br />
								</span>
							</>
						))}
				</div>
				{tips &&
					tips.map((tip, index) => (
						<p key={index} className="text-center">
							"{tip}"
						</p>
					))}
			</div>
		</div>
	);
}

export default App;
