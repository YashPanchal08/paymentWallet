import { Body, Controller, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { ProfileSetupService } from "./profileSetup.service";
import { NonAuthAdmin } from "src/guard/nonAuthAdmin.guard";
import { Request, Response } from "express";

@Controller({ path: '/user', version: '1' })

export class ProfileSetupController {

    constructor(
        @Inject(ProfileSetupService) private ProfileSetupService: ProfileSetupService,
        private readonly response: ResponseHelper,
        private readonly statuscode: statusCode,
    ) { }

    @Post('/login')
    @UseGuards(NonAuthAdmin)
    async login(@Req() req: Request, @Res() res: Response, @Body() body: any): Promise<any> {
        try {

            const data = await this.ProfileSetupService.login(body);
            await this.response.success(res, "PAGE_ADDED_SUCCESS", data, this.statuscode.success)

        } catch (error) {
            console.log(` Add category controller Error ${error}`);
            this.response.error(res, error.message, this.statuscode.error)

        }
    }


    // @Get('getAllPages')
    // async getAllPages(@Req() req: Request, @Res() res: Response, @Query() param: any) {
    //     try {

    //         const data = await this.ProfileSetupService.getAllPages(param);
    //         await this.response.success(res, "SUCCESS", data, this.statuscode.success)

    //     } catch (error) {
    //         console.log(` Get All Category controller Error ${error}`);
    //         this.response.error(res, error.message, this.statuscode.error)
    //     }
    // }

    // @Get('getPageById')
    // async getPageById(@Req() req: Request, @Res() res: Response, @Query() param: any) {
    //     try {

    //         const data = await this.ProfileSetupService.getPageById(param);
    //         await this.response.success(res, "SUCCESS", data, this.statuscode.success)

    //     } catch (error) {
    //         console.log(` Get Category By Id controller Error ${error}`);
    //         this.response.error(res, error.message, this.statuscode.error)
    //     }
    // }

    // @Delete('removePage')
    // async removePage(@Req() req: Request, @Res() res: Response, @Query() params: any): Promise<any> {
    //     try {

    //         let data = await this.ProfileSetupService.removePage(params);
    //         await this.response.success(res, "PAGE_DELETE_SUCCESS", data, this.statuscode.success)

    //     } catch (error) {
    //         console.log(` update Category By Id controller Error ${error}`);
    //         this.response.error(res, error.message, this.statuscode.error)
    //     }
    // }

    // @Put('editPage')
    // async editPage(@Req() req: Request, @Res() res: Response, @Body() body: any): Promise<any> {
    //     try {

    //         let data = await this.ProfileSetupService.editPage(body);
    //         await this.response.success(res, "PAGE_EDIT_SUCCESS", data, this.statuscode.success)

    //     } catch (error) {
    //         console.log(` update Category By Id controller Error ${error}`);
    //         this.response.error(res, error.message, this.statuscode.error)
    //     }
    // }


}