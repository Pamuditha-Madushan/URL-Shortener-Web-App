import { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import Url from "../models/urlModel";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/ClientErrors";

const generateShortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { url }: { url?: string } = req.body;

  const shortURLs: { [key: string]: string } = {};
  const keySet: Set<string> = new Set();

  if (!url)
    return next(new BadRequestError("Bad Request: Missing required Url !"));

  if (!/^http(s){0,1}:\/\//.test(url))
    return next(
      new BadRequestError("Long URL should start with 'http://' or 'https://'")
    );

  const key = nanoid(10);

  if (keySet.has(key))
    return next(new UnprocessableEntityError("Key is duplicated !"));

  keySet.add(key);
  shortURLs[key] = url;
  const shortUrl = `${process.env.BASE}/${key}`;

  try {
    const urlData = await Url.create({
      shortenUrl: shortUrl,
      redirectUrl: url,
      visitHistory: [],
    });

    console.log("URL Data:", urlData);

    return res.status(201).json({
      responseCode: 201,
      success: true,
      message: `URL data of "URL: ${urlData.redirectUrl}" saved successfully ...`,
      data: {
        shortenUrl: urlData.shortenUrl,
      },
    });
  } catch (error) {
    console.error("Failed to generate shorten url: ", error);
    return next(error);
  }
};

const handleAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const shortenUrl: string = decodeURIComponent(req.params.shortenUrl);

  console.log("Shorten Url: ", shortenUrl);

  try {
    const urlAnalytics = await Url.findOne({ shortenUrl });

    if (!urlAnalytics)
      return res.status(404).send({
        responseCode: 404,
        success: false,
        error: `Url analytics for ${shortenUrl} not found !`,
      });

    return res.status(200).json({
      responseCode: 200,
      success: true,
      message: `Url analytics for ${shortenUrl} retrieved successfully ...`,
      data: {
        originalUrl: urlAnalytics.redirectUrl,
        totalClicks: urlAnalytics.visitHistory.length,
        analytics: urlAnalytics.visitHistory,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve shorten url: ", error);
    return next(error);
  }
};

const handleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const shortenUrl: string = decodeURIComponent(req.params.shortenUrl);
  const ipAddress = req.ip || "unknown";

  try {
    const urlRedirectData = await Url.findOne({ shortenUrl });

    if (!urlRedirectData) {
      return res.status(404).send({
        responseCode: 404,
        success: false,
        error: `Shortened URL not found for: ${shortenUrl}`,
      });
    }

    urlRedirectData.visitHistory.push({
      timestamp: new Date(),
      ipAddress,
    });

    await urlRedirectData.save();

    return res.redirect(urlRedirectData.redirectUrl);
  } catch (error) {
    console.error("Error during redirecting: ", error);
    return next(error);
  }
};

export default { generateShortUrl, handleAnalytics, handleRedirect };
