package com.smartworks.fplanalyzer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;

public class Tester {
	
	public static void main(String[] args) throws IOException {
		ArrayList<Player> players = new ArrayList<Player>();
		
        // Make a URL to the web page
        URL url = new URL("https://fantasy.premierleague.com/player-list/");

        // Get the input stream through URL Connection
        URLConnection con = url.openConnection();
        InputStream is =con.getInputStream();

        // Once you have the Input Stream, it's just plain old Java IO stuff.

        // For this case, since you are interested in getting plain-text web page
        // I'll use a reader and output the text content to System.out.

        // For binary content, it's better to directly read the bytes from stream and write
        // to the target file.


        BufferedReader br = new BufferedReader(new InputStreamReader(is));

        String line = null;

        // read each line and write to System.out
        boolean inBody = false;
        String pos = "";
        
        while ((line = br.readLine()) != null) {
        	if(line.contains("<h2>")) {
        		line.trim();
        		pos = line.substring(line.indexOf("<h2>") + 4, line.indexOf("</h2>") - 1);
        	}
        	if(line.contains("<tbody>")) {
        		inBody = true;
        	}
        	if(line.contains("<thead>")) {
        		inBody = false;
        	}
            if(line.contains("<tr>") && inBody) {
            	String name = br.readLine().trim();
            	String team = br.readLine().trim();
            	String scoreStr = br.readLine().trim();
            	String priceStr = br.readLine().trim();
            	int score;
            	double price;
            	
            	name = name.substring(4,  name.length() - 5);
            	team = team.substring(4,  team.length() - 5);
            	scoreStr = scoreStr.substring(4,  scoreStr.length() - 5);
            	priceStr = priceStr.substring(6,  priceStr.length() - 5);
            	
            	try {
            		score = Integer.parseInt(scoreStr);
            	} catch(Exception e) {
            		e.printStackTrace();
            		score = -1;
            	}
            	try {
            		price = Double.parseDouble(priceStr);
            	} catch(Exception e) {
            		e.printStackTrace();
            		price = -1;
            	}
            	
            	players.add(new Player(name, team, pos, price, score));	
            }
        }
        
        System.out.println(players.toString());
	}

}
